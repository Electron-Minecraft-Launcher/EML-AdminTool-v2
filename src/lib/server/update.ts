import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { exec, spawn } from 'child_process'
import pkg from '../../../package.json'
import { sanitizePath } from './files'
import fs from 'fs/promises'
import { extract } from 'tar'

export async function getUpdate() {
  let data

  try {
    const response = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest')
    if (response.ok) {
      data = (await response.json()) as { tag_name: string; published_at: string; body: string }
    } else {
      console.error('Failed to fetch latest release:', response.statusText)
      data = { tag_name: pkg.version, published_at: Date.now().toString().split('T')[0], body: '' }
    }
  } catch (err) {
    console.error('Failed to fetch latest release:', err)
    data = { tag_name: pkg.version, published_at: Date.now().toString().split('T')[0], body: '' }
  }

  const currentVersion = pkg.version
  const latestVersion = data.tag_name.replace('v', '') ?? currentVersion
  const releaseDate = data.published_at.split('T')[0] ?? Date.now().toString().split('T')[0]
  const shortLastVersion = latestVersion.split('.').slice(0, 2).join('.')
  const logoUrl = `https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/refs/heads/main/.github/changelogs/v${shortLastVersion}.png`
  const changelogs = data.body

  return { currentVersion, latestVersion, releaseDate, logoUrl, changelogs }
}

/**
 * Events: `fetching`, `up-to-date`, `downloading`, `extracting`, `script`, `docker-load`, `docker-volume`, `docker-run`
 * Status: `in-progress`, `success`, `error`
 */
export async function update(controller: ReadableStreamDefaultController<any>, push: (data: any) => void) {
  const dest = sanitizePath('loader')
  let assets: { name: string; url: string }[] = []
  let currentVersion: string = ''
  let latestVersion: string = ''
  let files: string[] = []
  let loaderVolumeName: string = ''

  await fs.mkdir(dest, { recursive: true })

  push({ event: 'fetching', status: 'in-progress' })

  try {
    const response = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest')
    if (response.ok) {
      const data = (await response.json()) as { assets: { name: string; browser_download_url: string }[]; tag_name: string }
      data.assets.forEach(({ name, browser_download_url }) => assets.push({ name, url: browser_download_url }))
      latestVersion = data.tag_name.replace('v', '')
      currentVersion = pkg.version
    } else {
      console.error('Failed to fetch latest release:', response.statusText)
      push({ event: 'fetching', status: 'error' })
      controller.close()
      return
    }
  } catch (err) {
    console.error('Failed to fetch latest release:', err)
    push({ event: 'fetching', status: 'error' })
    controller.close()
    return
  }

  if (currentVersion === latestVersion) {
    push({ event: 'up-to-date', status: 'success' })
    return
  }

  const image = assets.find(({ name }) => name.startsWith('eml-admintool-') && name.endsWith('.tar.gz'))

  if (!image) {
    console.error('Update image not found in assets:', assets)
    push({ event: 'fetching', status: 'error' })
    controller.close()
    return
  }

  push({ event: 'fetching', status: 'success' })

  console.log('[DOWNLOAD] Downloading the update')
  push({ event: 'downloading', status: 'in-progress' })

  try {
    const response = await fetch(image.url, { headers: { Accept: 'application/octet-stream' } })

    if (!response.ok || !response.body) {
      console.log('Error downloading the update:', response.statusText)
      push({ event: 'downloading', status: 'error' })
      controller.close()
      return
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await fs.writeFile(`${dest}/${image.name}`, buffer)

    push({ event: 'downloading', status: 'success' })
  } catch (err) {
    console.log('Error downloading the update:', err)
    push({ event: 'downloading', status: 'error' })
    controller.close()
    return
  }

  console.log('[EXTRACT] Extracting the update')
  push({ event: 'extracting', status: 'in-progress' })

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
  } catch (err) {
    console.error('Error extracting the update:', err)
    push({ event: 'extracting', status: 'error' })
    controller.close()
    return
  }

  const imageFile = files.find((file) => file.endsWith('.tar') && !file.startsWith('._'))
  const composeFile = files.find((file) => file.endsWith('.prod.yml') && !file.startsWith('._'))
  const scriptFile = files.find((file) => file.endsWith('.sh') && !file.startsWith('._'))

  push({ event: 'extracting', status: 'success' })

  if (scriptFile) {
    push({ event: 'script', status: 'in-progress' })
    console.log(`[INSTALL SCRIPT] Running command: ${dest}/${scriptFile}`)

    try {
      await new Promise<void>((resolve, reject) => {
        spawn('chmod', ['+x', `${dest}/${scriptFile}`])
        const scriptExec = spawn(`${dest}/${scriptFile}`)
        scriptExec.stdout.on('data', (data) => console.log(`[INSTALL SCRIPT] ${data}`))
        scriptExec.stderr.on('data', (data) => console.error(`[INSTALL SCRIPT] ${data}`))
        scriptExec.on('close', (code) => {
          console.log(`[INSTALL SCRIP] Close with code ${code}`)
          if (code == 0) resolve()
          else reject(code)
        })
      })
      push({ event: 'script', status: 'success' })
    } catch (err) {
      console.error('Error running the update script:', err)
      push({ event: 'script', status: 'error' })
      controller.close()
      return
    }
  }

  console.log(`[DOCKER LOAD] Running command: docker load -i ${dest}/${imageFile}`)
  push({ event: 'docker-load', status: 'in-progress' })

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
    push({ event: 'docker-load', status: 'success' })
  } catch (err) {
    console.error('Unable to load the update:', err)
    push({ event: 'docker-load', status: 'error' })
    controller.close()
    return
  }

  console.log(`[DOCKER VOLUME] Running command: docker volume ls | grep eml_admintool | grep loader | awk '{print $2}'`)
  push({ event: 'docker-volume', status: 'in-progress' })

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
  } catch (err) {
    console.error('Unable to find loader volume:', err)
    push({ event: 'docker-volume', status: 'error' })
    controller.close()
    return
  }

  console.log(
    `[DOCKER RUN] Running command: docker run --rm --name eml_admintool-loader -v ${loaderVolumeName}:/app/loader -v /var/run/docker.sock:/var/run/docker.sock --privileged docker:latest sh -c docker-compose -f /app/loader/${composeFile} up -d`
  )
  push({ event: 'docker-run', status: 'in-progress' })

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
    push({ event: 'docker-run', status: 'success' }) // Note: This part of code may not be reached, because the server will be restarted.
  } catch (err) {
    console.error('Unable to run update:', err)
    push({ event: 'docker-run', status: 'error' })
    controller.close()
    return
  }

  // Note: This part of code may not be reached, because the server will be restarted.
  push({ event: 'update', status: 'success' })
  controller.close()
  return { httpStatus: 200, code: 'SUCCESS', message: 'Success', data: { version: latestVersion } }
}



