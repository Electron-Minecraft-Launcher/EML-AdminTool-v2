import { ModelResponse } from '../types/response'
import { query } from '../utils/database';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import { Config } from '../types/config';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt'

class Configure {

  public async database(body: any, status: number = 200, message: string = 'Success'): Promise<ModelResponse<null>> {

    try {
      await query('ALTER USER \'eml\'@\'localhost\' IDENTIFIED BY ?', [body.password])
    } catch (error: any) {
      status = 400
      message = error.code
    }

    if (status == 200) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+-=[]{};:<>,.?/';
      let secret = '';
      for (let i = 0; i < 128; i++) {
        secret += characters[Math.floor(Math.random() * characters.length)];
      }
      fs.writeFile(
        path.join(process.cwd(), '/.env'),
        `# # # # # # # # # # # # # # # # # # # # # # # # # # # #
#          DO NOT MODIFY OR DELETE THIS FILE          #
#                                                     #
# This file contains important environment variables  #
# for your application, including the password for    #
# your database and a JWT key. Modifying or deleting  #
# this file could prevent your application from       #
# functioning properly and potentially compromise its #
# security.                                           #
#                                                     #
# If you need to change any of these values, please   #
# use the appropriate configuration options rather    #
# than modifying this file directly.                  #
# Consult the documentation for your application for  #
# more information on how to configure these values   #
# safely.                                             #
# # # # # # # # # # # # # # # # # # # # # # # # # # # #

DATABASE_PASSWORD="${body.password}"
JWT_SECRET_KEY="${secret}"
`,
        () => { })
      process.env['DATABASE_PASSWORD'] = body.password
      process.env['JWT_SECRET_KEY'] = secret
      dotenv.config()
    }

    return {
      code: status,
      message: message
    }

  }

  public async language(body: any, status: number = 200, message: string = 'Success'): Promise<ModelResponse<null>> {

    const language = body.language == 'fr' ? 'fr' : 'en'
    var data: Config[] = []

    try {
      data = await query<Config[] & RowDataPacket[]>('SELECT * FROM config WHERE data = \'language\'')
    } catch (error: any) {
      status = 400
      message = error.code
    }

    if (status == 200) {

      if (data.find(language => language.data == 'language')) {
        try {
          await query('UPDATE config SET value = ? WHERE data = \'language\'', [language])
        } catch (error: any) {
          status = 400
          message = error.code
        }
      } else {
        try {
          await query('INSERT INTO config(data, value) VALUES (\'language\', ?)', [language])
        } catch (error: any) {
          status = 400
          message = error.code
        }
      }

    }

    return {
      code: status,
      message: message
    }

  }

  public async admin(body: any, status: number = 200, message: string = 'Success'): Promise<ModelResponse<null>> {

    const name = body.name || 'EML'
    const password = { clear: body.password || 'Temp_password', hash: await bcrypt.hash(body.password, 10) }
    var [isAdminInDB]: any = []

    try {
      [isAdminInDB] = await query('SELECT COUNT(*) AS count FROM users WHERE admin = 1')
    } catch (error: any) {
      status = 400
      message = error.code
    }

    if (status == 200) {

      if (isAdminInDB.count == 1) {
        try {
          await query('UPDATE users SET name = ?, password = ? WHERE admin = 1', [name, password.hash])
        } catch (error: any) {
          status = 400
          message = error.code
        }
      } else {
        try {
          await query('INSERT INTO users(name, password, status, admin, p_files_updater_add_del, p_bootstrap_mod, p_maintenance_mod, p_news_add, p_news_mod_del, p_news_category_add_mod_del, p_news_tag_add_mod_del, p_background_mod, p_stats_del) VALUES (?, ?, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)', [name, password.hash])
        } catch (error: any) {
          status = 400
          message = error.code
        }
      }

    }

    return {
      code: status,
      message: message
    }

  }

}

export default Configure
