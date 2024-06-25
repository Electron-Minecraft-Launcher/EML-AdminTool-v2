import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import envService from '../services/env.service'
import { ResponseType } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/file.model'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import fs from 'fs'

class FilesUpdater {
  async getFilesUpdater(req: Request): Promise<DataSuccess<File[]>> {
    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', await filesService.get(req, 'files-updater'))
  }

  async uploadFiles(req: Request): Promise<DataSuccess<File[]>> {
    const basePath = req.body && req.body.path ? `../files/files-updater/${req.body.path}/` : `../files/files-updater/`

    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true })

    return await this.getFilesUpdater(req)
  }

  async putRenameFile(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_add_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.old_path || body.old_path == '' || !body.new_path || body.new_path == '') {
      throw new RequestException('Missing parameters')
    }

    const r = filesService.rename('files-updater', body.old_path, body.new_path)
    if (r.status) {
      return await this.getFilesUpdater(req)
    } else {
      throw new RequestException(r.message || 'Error renaming file')
    }
  }

  async deleteFiles(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_add_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.paths) {
      throw new RequestException('Missing parameters')
    }

    try {
      body.paths = JSON.parse(body.paths)
    } catch (error) {
      throw new RequestException('Invalid parameters')
    }

    if (body.paths.length == 0) {
      throw new RequestException('Missing parameters')
    }

    body.paths.forEach((path: string) => {
      if (path + '' === '') {
        throw new RequestException('Invalid parameters')
      }
    })

    const r = filesService.delete('files-updater', body.paths)
    if (r.status) {
      return await this.getFilesUpdater(req)
    } else {
      throw new RequestException(r.message || 'Error deleting file')
    }
  }
}

export default FilesUpdater
