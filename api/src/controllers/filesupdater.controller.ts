import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import envService from '../services/env.service'
import { ResponseType } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/filesupdater.model'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'

class FilesUpdater {
  async getFilesUpdater(req: Request): Promise<DataSuccess<File[]>> {
    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', await filesService.get(req, 'files-updater'))
  }

  async uploadFilesUpdater(req: Request): Promise<DataSuccess<File[]>> {
    return await this.getFilesUpdater(req)
  }

  async putRenameFilesUpdater(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
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

  async deleteFilesUpdater(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_add_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.paths || body.paths.length == 0) {
      throw new RequestException('Missing parameters')
    }

    const r = filesService.delete('files-updater', body.paths)
    if (r.status) {
      return await this.getFilesUpdater(req)
    } else {
      throw new RequestException(r.message || 'Error deleting file')
    }
  }
}

export default FilesUpdater
