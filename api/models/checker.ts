import { Auth } from '../utils/auth';
import fs from 'fs';
import path from 'path';
import { dbGenerate, getTablesToGenerate, query } from '../utils/database';
import { IncomingHttpHeaders } from 'http';

export class Checker {

  async check(body: any, path: string, headers: IncomingHttpHeaders): Promise<'Needs configuration' | 'Allowed' | 'Unauthorized'> {

    if (path.startsWith('/api/swagger') || path.startsWith('/api/env')) {
      return 'Allowed'
    } else if (path.startsWith('/api/configure')) {

      if (!this.checkDotEnv() || !await this.checkDB() || !await this.checkAdminInDB() || (await new Auth().isAdmin(headers['authorization'] + ''))[0]) {
        await dbGenerate(await getTablesToGenerate())
        return 'Allowed'
      } else {
        return 'Unauthorized'
      }

    } else {

      if (!this.checkDotEnv() || !await this.checkDB() || !await this.checkAdminInDB()) {
        return 'Needs configuration'
      } else {
        return 'Allowed'
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
      console.error(error);
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
