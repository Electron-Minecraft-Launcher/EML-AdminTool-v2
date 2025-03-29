import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType } from '../../../shared/types/types'
import { IncomingHttpHeaders } from 'http'
import authService from '../services/auth.service'
import nexter from '../utils/nexter'
import { ServiceException } from '../responses/types'
import fetch from 'node-fetch'
import { Update as Update_ } from '../../../shared/types/data/update'
import pkg from '../../../package.json'

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
      // const response = new Response() //! DEV ONLY: Prevent rate limit
      // response.ok = false //! DEV ONLY: Prevent rate limit
      if (!response.ok) throw new Error('Unable to fetch the update.')
      data = (await response.json()) as { tag_name: string; published_at: string; body: string }
    } catch (error) {
      console.error(error)
      data = { tag_name: pkg.version, published_at: Date.now().toString().split('T')[0], body: '' }
    }

    const currentVersion = pkg.version
    const latestVersion = data.tag_name.replace('v', '') || currentVersion
    const releaseDate = data.published_at.split('T')[0] || Date.now().toString().split('T')[0]
    const shortLastVersion = latestVersion.split('.').slice(0, 2).join('.')
    const logoUrl = `https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/refs/heads/main/.changelogs/v${shortLastVersion}.png`
    const changelogs = data.body

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { currentVersion, latestVersion, releaseDate, logoUrl, changelogs })
  }
}

export default Update

