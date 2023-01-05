import { Auth } from './auth.service';
import fs from 'fs';
import path from 'path';
import { dbGenerate, getTablesToGenerate, query } from '../utils/database';
import { IncomingHttpHeaders } from 'http';
import { AUTH_ERROR, CONFIG_ERROR, ControllerResponse, SUCCESS } from '../models/types';
import { DefaultSuccess } from '../responses/success/default-success.response';
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response';
import { ConfigurationException } from '../responses/exceptions/configuration-exception.response';
import { DefaultServiceResponse } from '../models/responses/services/default-service-response.model';

export class Checker {

  async check(body: any, path: string, headers: IncomingHttpHeaders): Promise<DefaultServiceResponse> {

    if (path.startsWith('/api/swagger') || path.startsWith('/api/env')) {
      return { status: true, code: SUCCESS }
    } else if (path.startsWith('/api/configure')) {

      if (!this.checkDotEnv() || !await this.checkDB() || !await this.checkAdminInDB() || (await new Auth().isAdmin(headers['authorization'] + '')).status) {
        await dbGenerate(await getTablesToGenerate())
        return { status: true, code: SUCCESS }
      } else {
        return { status: false, code: AUTH_ERROR }
      }

    } else {

      if (!this.checkDotEnv() || !await this.checkDB() || !await this.checkAdminInDB()) {
        return { status: false, code: CONFIG_ERROR }
      } else {
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
    const tables: boolean[] = Object.entries(await getTablesToGenerate()).map(([key, value]) => (value))
    for (let table of tables) {
      if (table) {
        return false
      }
    }
    return true
  }

  private async checkAdminInDB(): Promise<boolean> {
    var [isAdminInDB]: any = []

    try {
      [isAdminInDB] = await query('SELECT COUNT(*) AS count FROM users WHERE admin = 1')
    } catch (error: any) {
      return true
    }

    if (isAdminInDB.count > 1) {
      throw new Error('Could not have more than one Admin. Please reset your EML AdminTool!');
    } else if (isAdminInDB.count == 1) {
      return true
    } else {
      return false
    }

  }

}
