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
}

export default Update

