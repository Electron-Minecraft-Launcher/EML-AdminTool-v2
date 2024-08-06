import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType } from '../../../shared/types/types'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import db from '../utils/db'
import { DBException } from '../responses/exceptions/db-exception.response'
import { Maintenance as Maintenance_ } from '../../../shared/types/features/maintenance'

class Maintenance {
  async getMaintenanceStatus(req: Request): Promise<DataSuccess<Maintenance_>> {
    let maintenance: Maintenance_

    try {
      maintenance = (await db.query<Maintenance_[]>('SELECT * FROM maintenance'))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (maintenance && maintenance.id) {
      delete maintenance.id
    } else {
      maintenance = {
        start_date: null,
        end_date: null,
        reason: ''
      }
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', maintenance)
  }

  async updateMaintenanceStatus(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<Maintenance_>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_maintenance_mod! != 1) {
      throw new UnauthorizedException()
    }

    const maintenance: Maintenance_ = {
      start_date: body.start_date && body.start_date != '' ? new Date(body.start_date) : null,
      end_date: body.end_date && body.end_date != '' ? new Date(body.end_date) : null,
      reason: body.reason || ''
    }

    try {
      await db.query(`DELETE FROM maintenance`)
      await db.query(`INSERT INTO maintenance (start_date, end_date, reason) VALUES (?, ?, ?)`, [
        maintenance.start_date,
        maintenance.end_date,
        maintenance.reason
      ])
    } catch (error: any) {
      throw new DBException()
    }

    return await this.getMaintenanceStatus(req)
  }
}

export default Maintenance
