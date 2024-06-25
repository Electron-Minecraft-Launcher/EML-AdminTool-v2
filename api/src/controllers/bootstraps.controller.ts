import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType, count } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/file.model'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import db from '../utils/db'

class Bootstraps {
  async getBootstraps(req: Request): Promise<DataSuccess<File[]>> {
    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', await filesService.get(req, 'bootstraps'))
  }

  async uploadBootstrap(req: Request, body: any): Promise<DataSuccess<File[]>> {
    let countBootstrap: count

    try {
      countBootstrap = (await db.query<count[]>('SELECT COUNT(*) AS count FROM bootstraps'))[0]
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!/(\d\.\d\.\d)(-[a-z]*(\.\d)?)?/gi.test(req.body.version)) {
      throw new RequestException('Invalid parameters')
    }

    return await this.getBootstraps(req)
  }

  async deleteBootstrap(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_add_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.platform) {
      throw new RequestException('Missing parameters')
    }

    if (body.platform !== 'win' && body.platform !== 'mac' && body.platform !== 'lin') {
      throw new RequestException('Invalid parameters')
    }

    // TODO get the file name from the database
    const r = filesService.delete('bootstraps', [body.platform])
    if (r.status) {
      return await this.getBootstraps(req)
    } else {
      throw new RequestException(r.message || 'Error deleting file')
    }
  }
}

export default Bootstraps
