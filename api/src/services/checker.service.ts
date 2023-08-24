import { AuthService } from './auth.service'
import fs from 'fs'
import path from 'path'
import db from '$utils/database'
import pin from '$utils/pin'
import { IncomingHttpHeaders } from 'http'
import { AUTH_ERROR, CONFIG_ERROR, count, SUCCESS } from '$models/types'
import { DefaultServiceResponse } from '$models/responses/services/default-service-response.model'

export class CheckerService {
  async check(body: any, path: string, headers: IncomingHttpHeaders): Promise<DefaultServiceResponse> {
    if (path.startsWith('/api/swagger') || path.startsWith('/api/env')) {
      return { status: true, code: SUCCESS }
    } else if (path.startsWith('/api/configure') && path != '/api/configure' && path != '/api/configure/') {
      if ((await this.needsConfiguration()) || (await new AuthService().isAdmin(headers['authorization'] + '')).status) {
        await db.dbGenerate(await db.getTablesToGenerate())
        await pin.check()
        return { status: true, code: SUCCESS }
      } else {
        return { status: false, code: AUTH_ERROR }
      }
    } else {
      if (await this.needsConfiguration()) {
        return { status: true, code: CONFIG_ERROR }
      } else {
        await pin.check()
        return { status: true, code: SUCCESS }
      }
    }
  }

  private checkDotEnv(): boolean {
    if (fs.existsSync(path.join(process.cwd(), '/.env')) && process.env['DATABASE_PASSWORD'] && process.env['JWT_SECRET_KEY']) {
      return true
    } else {
      return false
    }
  }

  private async checkDB(): Promise<boolean> {
    const tables: boolean[] = Object.entries(await db.getTablesToGenerate()).map(([key, value]) => value)
    for (let table of tables) {
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
    } else if (isAdminInDB.count == 1) {
      return true
    } else {
      return false
    }
  }

  private async needsConfiguration(): Promise<boolean> {
    return !this.checkDotEnv() || !(await this.checkDB()) || !(await this.checkAdminInDB())
  }
}
