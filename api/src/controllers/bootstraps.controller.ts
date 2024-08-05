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
import { DBException } from '../responses/exceptions/db-exception.response'
import { BootstrapsRes, Bootstraps as Bootstraps_ } from '../../../shared/models/features/bootstraps.model'

class Bootstraps {
  async getBootstraps(req: Request): Promise<DataSuccess<BootstrapsRes>> {
    let bootstrapsRes: BootstrapsRes = {
      win: null,
      mac: null,
      lin: null,
      version: ''
    }

    const bootstrapsFiles = await filesService.get(req, 'bootstraps')

    let bootstraps: Bootstraps_

    try {
      bootstraps = (await db.query<Bootstraps_[]>('SELECT * FROM bootstraps'))[0]
    } catch (error: any) {
      throw new DBException()
    }

    
    if (bootstraps && bootstraps.id) {
      bootstrapsRes = {
        win: bootstrapsFiles.find((file) => file.path === 'win/') || null,
        mac: bootstrapsFiles.find((file) => file.path === 'mac/') || null,
        lin: bootstrapsFiles.find((file) => file.path === 'lin/') || null,
        version: bootstraps.version || ''
      }
      if (bootstrapsRes.win) bootstrapsRes.win.path = ''
      if (bootstrapsRes.mac) bootstrapsRes.mac.path = ''
      if (bootstrapsRes.lin) bootstrapsRes.lin.path = ''
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', bootstrapsRes)
  }

  async uploadBootstrap(req: Request, body: any): Promise<DataSuccess<BootstrapsRes>> {
    let countBootstraps: count

    try {
      countBootstraps = (await db.query<count[]>('SELECT COUNT(*) AS count FROM bootstraps'))[0]
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!req.file || !req.file.originalname) {
      throw new RequestException('Missing file')
    }

    if (countBootstraps.count > 0) {
      try {
        await db.query(`UPDATE bootstraps SET version = ?, ${body.platform} = ? WHERE id = 1`, [body.version, req.file!.filename])
      } catch (error: any) {
        throw new DBException()
      }
    } else {
      try {
        await db.query(`INSERT INTO bootstraps (version, ${body.platform}) VALUES (?, ?)`, [body.version, req.file!.filename])
      } catch (error: any) {
        throw new DBException()
      }
    }

    return await this.getBootstraps(req)
  }

  async deleteBootstrap(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<BootstrapsRes>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_bootstraps_mod! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.platform) {
      throw new RequestException('Missing parameters')
    }

    if (body.platform !== 'win' && body.platform !== 'mac' && body.platform !== 'lin') {
      throw new RequestException('Invalid parameters')
    }

    let bootstraps: Bootstraps_

    try {
      bootstraps = (await db.query<Bootstraps_[]>('SELECT * FROM bootstraps'))[0]
    } catch (error: any) {
      throw new DBException()
    }

    const r = filesService.delete('bootstraps', [`${body.platform}/`])
    if (r.status) {
      return await this.getBootstraps(req)
    } else {
      throw new RequestException(r.message || 'Error deleting file')
    }
  }
}

export default Bootstraps
