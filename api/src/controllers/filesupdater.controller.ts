import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import envService from '../services/env.service'
import { ResponseType } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/filesupdater.model'
import filesService from '../services/files.service'

class FilesUpdater {
  async getFilesUpdater(req: Request): Promise<DataSuccess<File[]>> {
    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', await filesService.get(req, 'files-updater'))
  }

  async uploadFilesUpdater(req: Request): Promise<DataSuccess<File[]>> {
    return await this.getFilesUpdater(req)
  }
}

export default FilesUpdater
