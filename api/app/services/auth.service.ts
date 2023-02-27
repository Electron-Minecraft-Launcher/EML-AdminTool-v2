import { User } from '../models/features/user.model'
import db from '../utils/database'
import bcrypt from 'bcrypt'
import jwt from '../utils/jwt'
import jwt_ from 'jsonwebtoken'
import { DefaultServiceResponse } from '../models/responses/services/default-service-response.model'
import { AUTH_ERROR, CLIENT_ERROR, count, DB_ERROR, SUCCESS } from '../models/types'
import { DBException } from '../responses/exceptions/db-exception.response'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { DataServiceResponse } from '../models/responses/services/data-service-response.model'
import { ResultSetHeader } from 'mysql2'

export class Auth {

  async isAdmin(auth: string | undefined): Promise<DefaultServiceResponse> {

    if (auth && auth.startsWith('Basic ')) {
      const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii')
      const [name, password] = credentials.split(':')
      var user: User[] | null
      try {
        user = await db.query<User[]>('SELECT * FROM users WHERE name = ? AND admin = 1', [name])
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

      if (user[0] && user[0].name && await bcrypt.compare(password, user[0].password + '')) {
        return { status: true, code: SUCCESS }
      } else {
        return { status: false, code: AUTH_ERROR }
      }

    } else if (auth && auth.startsWith('Bearer ')) {

      const resp: [true, string | jwt_.JwtPayload] | [false, number, string] = await jwt.verify(auth.split(' ')[1])

      if (resp[0] && jwt.isJwtPayload(resp[1])) {
        var token = resp[1]
        if (token['admin']) {
          return { status: true, code: SUCCESS }
        } else {
          return { status: false, code: AUTH_ERROR }
        }
      } else {
        return { status: false, code: AUTH_ERROR }
      }

    } else {
      return { status: false, code: AUTH_ERROR }
    }


  }

  async isNameAvailable(name: string, excludeAdmin: boolean = false, excludeId: number | false = false): Promise<DefaultServiceResponse> {

    if (excludeAdmin && !excludeId) {
      var countName: count

      try {
        countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ? AND admin = 0', name))[0]
        if (countName.count > 0) {
          return { status: false, code: CLIENT_ERROR }
        }
        return { status: true, code: SUCCESS }
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

    }

    if (!excludeAdmin && excludeId !== false) {

      var countName: count

      try {
        countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ? AND id = ?', [name, excludeId]))[0]
        if (countName.count > 0) {
          return { status: false, code: CLIENT_ERROR }
        }
        return { status: true, code: SUCCESS }
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

    }

    if (excludeAdmin && excludeId !== false) {

      var countName: count

      try {
        countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ? AND admin = 1 AND id = ?', [name, excludeId]))[0]
        if (countName.count > 0) {
          return { status: false, code: CLIENT_ERROR }
        }
        return { status: true, code: SUCCESS }
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

    }

    var countName: count

    try {
      countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ?', name))[0]
      if (countName.count > 0) {
        return { status: false, code: CLIENT_ERROR }
      }
      return { status: true, code: SUCCESS }
    } catch (error: any) {
      return { status: false, code: DB_ERROR, message: error.code }
    }

  }

  /**
   * Check is the name is available before with `await new Auth().isNameAvailable()`!
   *
   * `user`'s password must be hashed.
   */
  async insertUser(user: User): Promise<DataServiceResponse<{ id: number }>> {

    try {
      let insertUser: ResultSetHeader = await db.query<ResultSetHeader>(
        `INSERT INTO users
        (
          name,
          password,
          status,
          admin,
          p_files_updater_add_del,
          p_bootstrap_mod,
          p_maintenance_mod,
          p_news_add,
          p_news_mod_del,
          p_news_category_add_mod_del,
          p_news_tag_add_mod_del,
          p_background_mod,
          p_stats_del
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.name + '',
          user.password + '',
          user.status! + 0 | 0,
          user.admin! + 0 | 0,
          user.p_files_updater_add_del! + 0 | 0,
          user.p_bootstrap_mod! + 0 | 0,
          user.p_maintenance_mod! + 0 | 0,
          user.p_news_add! + 0 | 0,
          user.p_news_mod_del! + 0 | 0,
          user.p_news_category_add_mod_del! + 0 | 0,
          user.p_news_tag_add_mod_del! + 0 | 0,
          user.p_background_mod! + 0 | 0,
          user.p_stats_del! + 0 | 0
        ]
      )
      return { status: true, code: SUCCESS, data: { id: insertUser.insertId } }
    } catch (error: any) {
      return { status: false, code: DB_ERROR, message: error.code }
    }

  }

}
