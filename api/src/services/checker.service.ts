import { IncomingHttpHeaders } from 'http'
import { DefaultServiceResponse } from '../../../shared/models/responses/services/default-service-response.model'
import { ResponseType, count } from '../../../shared/models/types'
import authService from './auth.service'
import fs from 'fs'
import path from 'path'
import db from '../utils/db'
import dotenv from 'dotenv'
import envService from './env.service'
import pinService from './pin.service'

class CheckerService {
  async check(body: any, path: string, headers: IncomingHttpHeaders): Promise<DefaultServiceResponse> {
    dotenv.config()

    const location = path.split('/')

    if (location[0] === '') location.shift()

    if (!location[0] || !location[1] || location[0] !== 'api' || location[1] === 'swagger' || location[1] === 'env') {
      return { status: true, code: ResponseType.SUCCESS }
    }

    let needsConfiguration = false

    if (!this.checkDotEnv()) {
      needsConfiguration = true
      envService.setEnv('eml')
    }

    if (!(await this.checkDB())) {
      needsConfiguration = true
      await db.generate(await db.getTablesToGenerate())
    }

    if (!(await this.checkAdminInDB())) {
      needsConfiguration = true
    }

    pinService.check()

    // If configuring
    if (location[1] === 'configure' && location[2] !== 'check') {
      if (needsConfiguration || (await authService.isAdmin(headers['authorization'] + '')).status) {
        return { status: true, code: ResponseType.SUCCESS }
      } else {
        return { status: false, code: ResponseType.AUTH_ERROR }
      }
    } else {
      if (needsConfiguration) {
        return { status: false, code: ResponseType.CONFIG_ERROR }
      } else {
        return { status: true, code: ResponseType.SUCCESS }
      }
    }
  }

  private checkDotEnv(): boolean {
    return (
      fs.existsSync(path.join(process.cwd(), '/.env')) &&
      process.env['DATABASE_PASSWORD'] !== undefined &&
      process.env['JWT_SECRET_KEY'] !== undefined
    )
  }

  private async checkDB(): Promise<boolean> {
    for (let table of Object.entries(await db.getTablesToGenerate()).map(([key, value]) => value)) {
      if (table) {
        return false
      }
    }
    return true
  }

  private async checkAdminInDB(): Promise<boolean> {
    var isAdminInDB: count

    try {
      isAdminInDB = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE admin = 1'))[0]
    } catch (error: any) {
      return false
    }

    if (isAdminInDB.count > 1) {
      throw new Error('Could not have more than one Admin. Please reset your EML AdminTool!')
    } else {
      return isAdminInDB.count == 1
    }
  }
}

export default new CheckerService()
