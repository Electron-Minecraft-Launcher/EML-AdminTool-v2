import { Socket } from '../services/socket.model'
import { Server, Socket as IO } from 'socket.io'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import pkg from '../../../package.json'
import filesService from '../services/files.service'
import fs from 'fs'
import { extract } from 'tar'
import fetch from 'node-fetch'
import { exec, spawn } from 'child_process'
import { ServerException } from '../responses/exceptions/server-exception.response'
import moment from 'moment'

export default class UpdateSocket implements Socket {
  async socket(io: IO) {
    try {
      nexter.serviceToException(await authService.isAdmin('Bearer ' + io.handshake.auth.token + ''))
    } catch (error: unknown) {
      io.emit('error', 'unauthorized')
      return
    }

    io.on('update', async () => {
      console.log(`LOG  ${moment().format('YYYY-MM-DD HH:mm:ss')}  ${io.handshake.address} Starting update`)

      try {
        const resp = await this.postUpdate(io)
        // Note: This part of code may not be reached, because the server will be restarted.
        console.log(`LOG  ${moment().format('YYYY-MM-DD HH:mm:ss')}  ${io.handshake.address} Updated to version ${resp.data.version}`)
      } catch (error: any) {
        console.error(
          `ERR  ${moment().format('YYYY-MM-DD HH:mm:ss')}  ${io.handshake.address} Unable to update with code ${error.httpStatus} and message '${error.message}'`
        )
      }
    })
  }

  private async postUpdate(io: IO): Promise<any> {
    const dest = `${filesService.cwd()}/loader`
    let assets: { name: string; url: string }[] = []
    let currentVersion: string = ''
    let latestVersion: string = ''
    let files: string[] = []
    let loaderVolumeName: string = ''

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

    io.emit('updating', 'fetching')

    try {
      const res = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest').then(
        (res) => res.json() as Promise<{ assets: { name: string; browser_download_url: string }[]; tag_name: string }>
      )
      res.assets.forEach(({ name, browser_download_url }) => assets.push({ name, url: browser_download_url }))
      latestVersion = res.tag_name.replace('v', '')
      currentVersion = pkg.version
      io.emit('updating_success', 'fetching')
    } catch (error) {
      io.emit('updating_error', 'fetching')
      throw new ServerException('Unable to fetch the update.')
    }

    if (currentVersion === latestVersion) {
      io.emit('updating_success', 'up-to-date')
      return
    }

    const image = assets.find(({ name }) => name.startsWith('eml-admintool-') && name.endsWith('.tar.gz'))

    if (!image) {
      io.emit('updating_error', 'fetching')
      throw new ServerException('Unable to find the update.')
    }

    console.log('[DOWNLOAD] Downloading the update')
    io.emit('updating', 'downloading')

    try {
      const imageResponse = await fetch(image.url, { headers: { Accept: 'application/octet-stream' } })
      const imageStream = fs.createWriteStream(`${dest}/${image.name}`)
      await new Promise<void>((resolve, reject) => {
        imageResponse.body.pipe(imageStream)
        imageResponse.body.on('error', reject)
        imageStream.on('finish', resolve)
      })
      io.emit('updating_success', 'downloading')
    } catch (error) {
      io.emit('updating_error', 'downloading')
      throw new ServerException('Unable to download the update.')
    }

    console.log('[EXTRACT] Extracting the update')
    io.emit('updating', 'extracting')

    try {
      await extract({
        file: `${dest}/${image.name}`,
        cwd: dest,
        keep: false,
        onReadEntry: (entry) => {
          console.log(`[EXTRACT] Extracting ${entry.path}`)
          files.push(entry.path)
        }
      })
    } catch (error) {
      io.emit('updating_error', 'extracting')
      throw new ServerException('Unable to extract the update.')
    }

    const imageFile = files.find((file) => file.endsWith('.tar') && !file.startsWith('._'))
    const composeFile = files.find((file) => file.endsWith('.prod.yml') && !file.startsWith('._'))
    const scriptFile = files.find((file) => file.endsWith('.sh') && !file.startsWith('._'))

    io.emit('updating_success', 'extracting')

    if (scriptFile) {
      io.emit('updating', 'script')
      console.log(`[INSTALL SCRIPT] Running command: ${dest}/${scriptFile}`)

      try {
        await new Promise<void>((resolve, reject) => {
          spawn('chmod',  ['+x', `${dest}/${scriptFile}`])
          const scriptExec = spawn(`${dest}/${scriptFile}`)
          scriptExec.stdout.on('data', (data) => console.log(`[INSTALL SCRIPT] ${data}`))
          scriptExec.stderr.on('data', (data) => console.error(`[INSTALL SCRIPT] ${data}`))
          scriptExec.on('close', (code) => {
            console.log(`[INSTALL SCRIP] Close with code ${code}`)
            if (code == 0) resolve()
            else reject(code)
          })
        })
        io.emit('updating_success', 'script')
      } catch (error) {
        io.emit('updating_error', 'script', { error })
        throw new ServerException('Unable to run the update script.')
      }
    }

    io.emit('updating', 'docker_load')
    console.log(`[DOCKER LOAD] Running command: docker load -i ${dest}/${imageFile}`)

    try {
      await new Promise<void>((resolve, reject) => {
        const load = spawn('docker', ['load', '-i', `${dest}/${imageFile}`])
        load.stdout.on('data', (data) => console.log(`[DOCKER LOAD] ${data}`))
        load.stderr.on('data', (data) => console.error(`[DOCKER LOAD] ${data}`))
        load.on('close', (code) => {
          console.log(`[DOCKER LOAD] Close with code ${code}`)
          if (code == 0) resolve()
          else reject(code)
        })
      })
      io.emit('updating_success', 'docker_load')
    } catch (error) {
      io.emit('updating_error', 'docker_load', { error })
      throw new ServerException('Unable to load the update.')
    }

    io.emit('updating', 'docker_volume')
    console.log(`[DOCKER VOLUME] Running command: docker volume ls | grep eml_admintool | grep loader | awk '{print $2}'`)

    try {
      loaderVolumeName = await new Promise<string>((resolve, reject) => {
        exec("docker volume ls | grep eml_admintool | grep loader | awk '{print $2}'", (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else if (process.env.NODE_ENV === 'development') {
            // Note: Update should not be performed in development environment.
            const vol = stdout.split('\n').find((line) => line.includes('dev'))
            if (vol) resolve(vol)
            else reject('Volume not found')
          } else {
            const vol = stdout.split('\n').find((line) => !line.includes('dev'))
            if (vol) resolve(vol)
            else reject('Volume not found')
          }
        })
      })
    } catch (error) {
      io.emit('updating_error', 'docker_load', { error })
      throw new ServerException('Unable to find the loader volume.')
    }

    io.emit('updating', 'docker_run')
    console.log(
      `[DOCKER RUN] Running command: docker run --rm --name eml_admintool-loader -v ${loaderVolumeName}:/app/loader -v /var/run/docker.sock:/var/run/docker.sock --privileged docker:latest sh -c docker-compose -f /app/loader/${composeFile} up -d`
    )

    try {
      await new Promise<void>((resolve, reject) => {
        const run = spawn('docker', [
          'run',
          '--rm',
          '--name',
          'eml_admintool-loader',
          '-v',
          `${loaderVolumeName}:/app/loader`,
          '-v',
          '/var/run/docker.sock:/var/run/docker.sock',
          '--privileged',
          'docker:latest',
          'sh',
          '-c',
          `docker-compose -f /app/loader/${composeFile} up -d`
        ])
        run.stdout.on('data', (data) => console.log(`[DOCKER RUN] ${data}`))
        run.stderr.on('data', (data) => console.error(`[DOCKER RUN] ${data}`))
        run.on('close', (code) => {
          console.log(`[DOCKER RUN] Close with code ${code}`)
          if (code == 0)
            resolve() // Note: This part of code may not be reached, because the server will be restarted.
          else reject(code)
        })
      })
      io.emit('updating_success', 'docker_run') // Note: This part of code may not be reached, because the server will be restarted.
    } catch (error) {
      io.emit('updating_error', 'docker_run', { error })
      throw new ServerException('Unable to run the update.')
    }

    // Note: This part of code may not be reached, because the server will be restarted.
    io.emit('updating_success', 'done')
    return { httpStatus: 200, code: 'SUCCESS', message: 'Success', data: { version: latestVersion } }
  }
}


