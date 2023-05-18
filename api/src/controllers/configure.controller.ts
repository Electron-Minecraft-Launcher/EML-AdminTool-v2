import { DefaultSuccess } from '$responses/success/default-success.response'
import db from '$utils/database'
import { EnvService } from '$services/env.service'
import { Config } from '$models/configurations/config.model'
import bcrypt from 'bcrypt'
import { count, AUTH_ERROR, CLIENT_ERROR, DB_ERROR } from '$models/types'
import { DBException } from '$responses/exceptions/db-exception.response'
import { ServerException } from '$responses/exceptions/server-exception.response'
import { NextFunction } from 'express'
import { AuthService } from '$services/auth.service'
import { UnauthorizedException } from '$responses/exceptions/unauthorized-exception.response'
import { User } from '$models/features/user.model'

export default class Configure {
  async check(body: any, next: NextFunction): Promise<DefaultSuccess> {
    return new DefaultSuccess()
  }

  async database(body: any, next: NextFunction): Promise<DefaultSuccess> {
    try {
      await db.query("ALTER USER 'eml'@'localhost' IDENTIFIED BY ?", [body.password])
    } catch (error: any) {
      next(new DBException(error.code))
      throw null
    }

    try {
      new EnvService().setEnv(body.password)
    } catch (error: any) {
      next(new ServerException(error.message))
      throw null
    }

    return new DefaultSuccess()
  }

  async language(body: any, next: NextFunction): Promise<DefaultSuccess> {
    const language = body.language == 'fr' ? 'fr' : 'en'
    var data: Config[] = []

    try {
      data = await db.query<Config[]>("SELECT * FROM config WHERE data = \"'language'")
    } catch (error: any) {
      next(new DBException(error.code))
      throw null
    }

    if (data.find((language) => language.data == 'language')) {
      try {
        await db.query("UPDATE config SET value = ? WHERE data = 'language'", [language])
      } catch (error: any) {
        next(new DBException(error.code))
        throw null
      }
    } else {
      try {
        await db.query("INSERT INTO config(data, value) VALUES ('language', ?)", [language])
      } catch (error: any) {
        next(new DBException(error.code))
        throw null
      }
    }

    return new DefaultSuccess()
  }

  async admin(body: any, next: NextFunction): Promise<DefaultSuccess> {
    const name = body.name || 'EML'
    const password = {
      clear: body.password || 'Temp_password',
      hash: await bcrypt.hash(body.password, 10),
    }
    var isAdminInDB: count

    try {
      isAdminInDB = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE admin = 1'))[0]
    } catch (error: any) {
      next(new DBException())
      throw null
    }

    var isNameAvailable = (await new AuthService().isNameAvailable(name, true)).code

    if (isNameAvailable == CLIENT_ERROR) {
      next(new UnauthorizedException('Name used'))
      throw null
    } else if (isNameAvailable == DB_ERROR) {
      next(new DBException())
      throw null
    }

    if (isAdminInDB.count == 1) {
      try {
        await db.query('UPDATE users SET name = ?, password = ? WHERE admin = 1', [name, password.hash])
      } catch (error: any) {
        next(new DBException(error.code))
        throw null
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
        p_stats_del: 1,
      }
      let addAdmin = await new AuthService().insertUser(admin)
      if (addAdmin.code == DB_ERROR) {
        next(new DBException())
        throw null
      }
    }

    return new DefaultSuccess()
  }
}
