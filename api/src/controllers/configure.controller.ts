import bcrypt from 'bcrypt'
import { NextFunction, Request } from 'express'
import { IncomingHttpHeaders } from 'http'
import { env } from 'process'
import { User } from '../../../shared/models/features/user.model'
import { ResponseType, count } from '../../../shared/models/types'
import { DBException } from '../responses/exceptions/db-exception.response'
import { ServerException } from '../responses/exceptions/server-exception.response'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { DefaultSuccess } from '../responses/success/default-success.response'
import { ServiceException } from '../responses/types'
import db from '../utils/db'
import nexter from '../utils/nexter'
import envService from '../services/env.service'
import languageService from '../services/language.service'
import authService from '../services/auth.service'
import adminService from '../services/admin.service'
import filesService from '../services/files.service'

export default class Configure {
  async check(req: Request<any>): Promise<DefaultSuccess> {
    return new DefaultSuccess(req)
  }

  async database(req: Request<any>, body: any): Promise<DefaultSuccess> {
    try {
      await db.query("ALTER USER 'eml'@'%' IDENTIFIED BY ?", [body.password])
    } catch (error: any) {
      throw new DBException(error.code)
    }

    try {
      envService.setEnv(body.password)
    } catch (error: any) {
      throw new ServerException(error.message)
    }

    return new DefaultSuccess(req)
  }

  async language(req: Request<any>, body: any): Promise<DefaultSuccess> {
    const language = body.language == 'fr' ? 'fr' : 'en'

    try {
      await languageService.check(language)
    } catch (error) {
      throw new DBException()
    }

    return new DefaultSuccess(req)
  }

  async admin(req: Request<any>, body: any): Promise<DefaultSuccess> {
    const name = body.name || 'EML'
    const password = {
      clear: body.password || 'Temp_password',
      hash: await bcrypt.hash(body.password, 10)
    }
    var isAdminInDB: count

    try {
      isAdminInDB = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE admin = 1'))[0]
    } catch (error: any) {
      throw new DBException()
    }

    var isNameAvailable = (await adminService.isNameAvailable(name, true)).code
    if (isNameAvailable == ResponseType.DATABASE_ERROR) {
      throw new DBException()
    }

    if (isNameAvailable == ResponseType.CLIENT_ERROR) {
      throw new UnauthorizedException('Name used')
    }

    if (isAdminInDB.count == 1) {
      try {
        await db.query('UPDATE users SET name = ?, password = ? WHERE admin = 1', [name, password.hash])
      } catch (error: any) {
        throw new DBException(error.code)
      }
    } else {
      const admin: User = {
        name: name,
        password: password.hash,
        status: 1,
        admin: 1,
        p_files_updater_add_del: 1,
        p_bootstrap_mod: 1,
        p_maintenance_mod: 1,
        p_news_add: 1,
        p_news_mod_del: 1,
        p_news_category_add_mod_del: 1,
        p_news_tag_add_mod_del: 1,
        p_background_mod: 1,
        p_stats_see: 1,
        p_stats_del: 1
      }
      let addAdmin = await adminService.insertUser(admin)
      if (addAdmin.code == ResponseType.DATABASE_ERROR) {
        throw new DBException()
      }
    }

    return new DefaultSuccess(req)
  }

  async reset(req: Request<any>, headers: IncomingHttpHeaders): Promise<DefaultSuccess> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    try {
      filesService.delete('files-updater', [''])
      filesService.delete('bootstraps', [''])
      filesService.delete('backgrounds', [''])
      await db.query('DROP DATABASE eml_admintool')
      await db.query('CREATE DATABASE eml_admintool')
      await db.generate(await db.getTablesToGenerate())
    } catch (error: any) {
      throw new DBException(error)
    }

    return new DefaultSuccess(req)
  }
}
