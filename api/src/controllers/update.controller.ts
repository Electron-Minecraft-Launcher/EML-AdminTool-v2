import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType } from '../../../shared/types/types'
import { DefaultSuccess } from '../responses/success/default-success.response'
import { IncomingHttpHeaders } from 'http'
import authService from '../services/auth.service'
import nexter from '../utils/nexter'
import { ServiceException } from '../responses/types'
import { ServerException } from '../responses/exceptions/server-exception.response'
import filesService from '../services/files.service'
import fs from 'fs'
import fetch from 'node-fetch'
import { exec, spawn } from 'child_process'
import { Update as Update_ } from '../../../shared/types/data/update'
import pkg from '../../../package.json'

class Update {
  async getUpdate(req: Request, headers: IncomingHttpHeaders): Promise<DataSuccess<Update_>> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    let data: { tag_name: string; published_at: string } = { tag_name: '', published_at: '' }

    try {
      const response = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest')
      data = (await response.json()) as { tag_name: string; published_at: string }
    } catch (error) {
      console.log(error)
    }

    const currentVersion = pkg.version
    const latestVersion = data.tag_name.replace('v', '') || currentVersion
    const releaseDate = data.published_at.split('T')[0] || Date.now().toString()
    const shortLastVersion = latestVersion.split('.').slice(0, 2).join('.')
    const logoUrl = `https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/refs/heads/main/.changelogs/v${shortLastVersion}.png`
    const changelogs =
      (await fetch(`https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/main/.changelogs/v${latestVersion}.md`).then(
        (res) => res.text()
      )) || ''
    // const changelogs =
    //   (await fetch(`https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/main/.changelogs/TEMPLATE.md`).then(
    //     (res) => res.text()
    //   )) || ''

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { currentVersion, latestVersion, releaseDate, logoUrl, changelogs })
  }

  async postUpdate(req: Request, headers: IncomingHttpHeaders): Promise<DefaultSuccess> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    const dest = `${filesService.cwd()}/update`

    let assets: { name: string; url: string }[] = []
    let currentVersion: string = ''
    let latestVersion: string = ''

    try {
      const res = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest').then(
        (res) => res.json() as Promise<{ assets: { name: string; browser_download_url: string }[]; tag_name: string }>
      )
      res.assets.forEach(({ name, browser_download_url }: { name: string; browser_download_url: string }) => {
        assets.push({ name, url: browser_download_url })
      })
      latestVersion = res.tag_name.replace('v', '')
      currentVersion = pkg.version
    } catch (error) {
      throw new ServerException()
    }

    if (currentVersion === latestVersion) {
      return new DefaultSuccess(req, 200, ResponseType.SUCCESS, 'No updates available')
    }

    const image = assets.find(({ name }) => name.startsWith('eml-admintool-') && name.endsWith('.tar.gz'))
    const compose = assets.find(({ name }) => name.startsWith('docker-compose') && name.endsWith('.yml'))
    const script = assets.find(({ name }) => name.startsWith('update.sh'))

    if (!image || !compose || !script) {
      console.log(image, compose, script)
      throw new ServerException()
    }

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

    try {
      const imageResponse = await fetch(image.url, { headers: { Accept: 'application/octet-stream' } })
      const imageStream = fs.createWriteStream(`${dest}/${image.name}`)
      await new Promise<void>((resolve, reject) => {
        imageResponse.body.pipe(imageStream)
        imageResponse.body.on('error', reject)
        imageStream.on('finish', resolve)
      })

      const composeResponse = await fetch(compose.url, { headers: { Accept: 'application/octet-stream' } })
      const composeStream = fs.createWriteStream(`${dest}/${compose.name}`)
      await new Promise<void>((resolve, reject) => {
        composeResponse.body.pipe(composeStream)
        composeResponse.body.on('error', reject)
        composeStream.on('finish', resolve)
      })

      const scriptResponse = await fetch(script.url, { headers: { Accept: 'application/octet-stream' } })
      const scriptStream = fs.createWriteStream(`${dest}/${script.name}`)
      await new Promise<void>((resolve, reject) => {
        scriptResponse.body.pipe(scriptStream)
        scriptResponse.body.on('error', reject)
        scriptStream.on('finish', resolve)
      })
    } catch (error) {
      throw new ServerException()
    }

    exec(`chmod +x ${dest}/${script.name}`)

    fs.writeFileSync(
      `${dest}/Dockerfile`,
      `FROM alpine:latest

WORKDIR /app

# Install dependencies
RUN apk update && \
  apk add --no-cache build-base wget binutils

# Install curl
RUN wget -qO- https://curl.se/download/curl-7.78.0.tar.gz | tar -xz && \\
  ls && \\
  cd curl-7.78.0 && \\
  ./configure --without-ssl && \\
  make && \\
  make install && \\
  cd .. && \\
  rm -rf curl-7.78.0

# Install Docker
RUN wget -qO- https://download.docker.com/linux/static/stable/x86_64/docker-20.10.8.tgz | tar -xz && \\
  mv docker/docker /usr/local/bin/ && \\
  rm -rf docker

# Install Docker Compose
RUN wget -O /usr/local/bin/docker-compose https://github.com/docker/compose/releases/download/1.29.2/docker-compose-\`uname -s\`-\`uname -m\` && \\
  chmod +x /usr/local/bin/docker-compose

# Install jq
RUN wget -O jq https://github.com/stedolan/jq/releases/download/jq-1.7.1/jq-linux64 && \\
  chmod +x ./jq && \\
  cp jq /usr/bin

RUN rm -rf /var/cache/apk/* && \\
  rm -rf curl-7.78.0

CMD ["ls"]
`
    )

    this.docker('BUILD', 'build', '-t', 'eml-admintool-update', '-f', `${dest}/Dockerfile`, dest)

    return new DefaultSuccess(req, 200, ResponseType.SUCCESS, 'Update downloaded')
  }

  private async docker(name: string, ...args: string[]): Promise<void> {
    const docker = spawn('docker', args)
    console.log('=> RUNNING', args.join(' '))
    docker.stdout.on('data', (data) => {
      console.log(`[DOCKER ${name} stdout] ${data}`)
    })
    docker.stderr.on('data', (data) => {
      console.error(`[DOCKER ${name} stderr] ${data}`)
    })
    docker.on('close', (code) => {
      console.log(`[DOCKER ${name} close] Code ${code}`)
      if (code === 0) this.docker('RUN', 'run', '-v', '/app/update:/app/update', '--name', 'eml-admintool-update', 'eml-admintool-update')
    })
  }
}

export default Update

