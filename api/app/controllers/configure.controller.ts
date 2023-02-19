import { DefaultSuccess } from '../responses/success/default-success.response';
import db from '../utils/database2';
import { setEnv } from '../services/env.service'
import { Config } from '../models/configurations/config.model';
import bcrypt from 'bcrypt';
import { ControllerResponse } from '../models/types';
import { DBException } from '../responses/exceptions/db-exception.response';
import { ServerException } from '../responses/exceptions/server-exception.response';
import { NextFunction } from 'express';

export default class Configure {

  async database(body: any, next: NextFunction): Promise<DefaultSuccess> {

    try {
      await db.query('ALTER USER \'eml\'@\'localhost\' IDENTIFIED BY ?', [body.password])
    } catch (error: any) {
      console.log(error);

      next(new DBException(error.code))
      throw null
    }

    try {
      setEnv(body.password)
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
      data = await db.query<Config[]>('SELECT * FROM config WHERE data = \'language\'')
    } catch (error: any) {
      next(new DBException(error.code))
      throw null
    }

    if (data.find(language => language.data == 'language')) {
      try {
        await db.query('UPDATE config SET value = ? WHERE data = \'language\'', [language])
      } catch (error: any) {
        next(new DBException(error.code))
        throw null
      }
    } else {
      try {
        await db.query('INSERT INTO config(data, value) VALUES (\'language\', ?)', [language])
      } catch (error: any) {
        next(new DBException(error.code))
        throw null
      }
    }


    return new DefaultSuccess()

  }

  async admin(body: any, next: NextFunction): Promise<DefaultSuccess> {

    const name = body.name || 'EML'
    const password = { clear: body.password || 'Temp_password', hash: await bcrypt.hash(body.password, 10) }
    var [isAdminInDB]: any = []

    try {
      [isAdminInDB] = await db.query('SELECT COUNT(*) AS count FROM users WHERE admin = 1')
    } catch (error: any) {
      next(new DBException(error.code))
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
      try {
        await db.query('INSERT INTO users(name, password, status, admin, p_files_updater_add_del, p_bootstrap_mod, p_maintenance_mod, p_news_add, p_news_mod_del, p_news_category_add_mod_del, p_news_tag_add_mod_del, p_background_mod, p_stats_del) VALUES (?, ?, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)', [name, password.hash])
      } catch (error: any) {
        next(new DBException(error.code))
        throw null
      }
    }

    return new DefaultSuccess()

  }

}
