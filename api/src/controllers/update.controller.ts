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
import { extract } from 'tar'

class Update {
  async getUpdate(req: Request, headers: IncomingHttpHeaders): Promise<DataSuccess<Update_>> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    let data: { tag_name: string; published_at: string; body: string } = { tag_name: '', published_at: '', body: '' }

    try {
      const response = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest')
      data = (await response.json()) as { tag_name: string; published_at: string; body: string }
    } catch (error) {
      console.log(error)
    }

    const currentVersion = pkg.version
    const latestVersion = data.tag_name.replace('v', '') || currentVersion
    const releaseDate = data.published_at.split('T')[0] || Date.now().toString()
    const shortLastVersion = latestVersion.split('.').slice(0, 2).join('.')
    const logoUrl = `https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/refs/heads/main/.changelogs/v${shortLastVersion}.png`
    const changelogs = data.body
    // const changelogs =
    //   (await fetch(`https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/main/.changelogs/TEMPLATE.md`).then(
    //     (res) => res.text()
    //   )) || ''

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { currentVersion, latestVersion, releaseDate, logoUrl, changelogs })
  }

  async postUpdate(req: Request, headers: IncomingHttpHeaders): Promise<DefaultSuccess> {
    // TODO handle error with async function

    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    let assets: { name: string; url: string }[] = []
    let currentVersion: string = ''
    let latestVersion: string = ''

    try {
      const res = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest').then(
        (res) => res.json() as Promise<{ assets: { name: string; browser_download_url: string }[]; tag_name: string }>
      )
      res.assets.forEach(({ name, browser_download_url }) => assets.push({ name, url: browser_download_url }))
      latestVersion = res.tag_name.replace('v', '')
      currentVersion = pkg.version
    } catch (error) {
      throw new ServerException()
    }

    if (currentVersion === latestVersion) {
      return new DefaultSuccess(req, 200, ResponseType.SUCCESS, 'No updates available')
    }

    const image = assets.find(({ name }) => name.startsWith('eml-admintool-') && name.endsWith('.tar.gz'))

    if (!image) {
      console.log(image)
      throw new ServerException()
    }

    const dest = `${filesService.cwd()}/loader`

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

    try {
      const imageResponse = await fetch(image.url, { headers: { Accept: 'application/octet-stream' } })
      const imageStream = fs.createWriteStream(`${dest}/${image.name}`)
      await new Promise<void>((resolve, reject) => {
        imageResponse.body.pipe(imageStream)
        imageResponse.body.on('error', reject)
        imageStream.on('finish', resolve)
      })
    } catch (error) {
      throw new ServerException('Failed to download update')
    }

    let files: string[] = []
    await extract({
      file: `${dest}/${image.name}`,
      cwd: dest,
      keep: false,
      onReadEntry: (entry) => {
        console.log(`[EXTRACT] ${entry.path}`)
        files.push(entry.path)
      }
    })

    const imageFile = files.find((file) => file.endsWith('.tar') && !file.startsWith('._'))
    const composeFile = files.find((file) => file.endsWith('.prod.yml') && !file.startsWith('._'))
    const scriptFile = files.find((file) => file.endsWith('.sh') && !file.startsWith('._'))

    console.log(files, imageFile, composeFile, scriptFile)

    if (scriptFile) {
      exec(`chmod +x ${dest}/${scriptFile}`)

      const scriptExec = spawn(`${dest}/${scriptFile}`)
      scriptExec.stdout.on('data', (data) => console.log(`[INSTALL SCRIPT] ${data}`))
      scriptExec.stderr.on('data', (data) => console.error(`[INSTALL SCRIPT] ${data}`))
      scriptExec.on('close', (code) => {
        console.log(`[INSTALL] Close with code ${code}`)
        // TODO handle error
      })
    }

    // TODO handle error
    console.log(`[DOCKER LOAD] Running command: docker load -i ${dest}/${imageFile}`)
    await new Promise<void>((resolve, reject) => {
      const load = spawn('docker', ['load', '-i', `${dest}/${imageFile}`])
      load.stdout.on('data', (data) => console.log(`[DOCKER LOAD] ${data}`))
      load.stderr.on('data', (data) => console.error(`[DOCKER LOAD] ${data}`))
      load.on('close', (code) => {
        console.log(`[DOCKER LOAD] Close with code ${code}`)
        if (code === 0) resolve()
        else reject()
      })
    })

    console.log(`[DOCKER COMPOSE] Running command: docker-compose -f ${dest}/${composeFile} up -d`)
    await new Promise<void>((resolve, reject) => {
      const compose = spawn('docker-compose', ['-f', `${dest}/${composeFile}`, 'up', '-d'])
      compose.stdout.on('data', (data) => console.log(`[DOCKER COMPOSE] ${data}`))
      compose.stderr.on('data', (data) => console.error(`[DOCKER COMPOSE] ${data}`))
      compose.on('close', (code) => {
        console.log(`[DOCKER COMPOSE] Close with code ${code}`)
        if (code === 0) resolve()
        else reject()
      })
    })

    return new DefaultSuccess(req, 200, ResponseType.SUCCESS, 'Update downloaded')
  }
}

export default Update

