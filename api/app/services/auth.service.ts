import { User } from '../models/features/user.model'
import db from '../utils/database'
import bcrypt from 'bcrypt'
import jwt from '../utils/jwt'
import jwt_ from 'jsonwebtoken'
import { DefaultServiceResponse } from '../models/responses/services/default-service-response.model'
import { AUTH_ERROR, CLIENT_ERROR, count, DB_ERROR, SUCCESS, UNKNOWN_ERROR } from '../models/types'
import { DataServiceResponse } from '../models/responses/services/data-service-response.model'
import { ResultSetHeader } from 'mysql2'

export class AuthService {

  /**
   * @param auth Auth string including `Basic` or `Bearer`.
   */
  async isAdmin(auth: string | undefined): Promise<DefaultServiceResponse> {

    // if (auth && auth.startsWith('Basic ')) {
    //   const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii')
    //   const [name, password] = credentials.split(':')
    //   var user: User[] | null

    //   try {
    //     user = await db.query<User[]>('SELECT * FROM users WHERE name = ? AND admin = 1', [name])
    //   } catch (error: any) {
    //     return { status: false, code: DB_ERROR }
    //   }

    //   if (!user[0] || !user[0].name || !(await bcrypt.compare(password, user[0].password + ''))) {
    //     return { status: false, code: AUTH_ERROR }
    //   }

    //   return { status: true, code: SUCCESS }

    // } else if (auth && auth.startsWith('Bearer ')) {

    //   const dec = await jwt.verify(auth.split(' ')[1])

    //   if (!dec[0]) {
    //     if (dec[1] == 401) {
    //       return { status: false, code: AUTH_ERROR, message: dec[2] }
    //     } else if (dec[1] == 500) {
    //       return { status: false, code: DB_ERROR }
    //     } else {
    //       return { status: false, code: UNKNOWN_ERROR }
    //     }
    //   }

    //   if (!jwt.isJwtPayload(dec[1]) || !dec[1]['admin']) {
    //     return { status: false, code: AUTH_ERROR }
    //   }

    //   return { status: true, code: SUCCESS }

    // }

    let auth_ = await this.checkAuth(auth + '')

    if (!auth_.status) {
      return auth_
    }

    if (!auth_.data?.admin) {
      return { status: false, code: AUTH_ERROR }
    }

    return { status: true, code: SUCCESS }

  }

  async isNameAvailable(name: string, excludeAdmin: boolean = false, excludeId: number | false = false): Promise<DefaultServiceResponse> {

    var countName: count

    if (excludeAdmin && !excludeId) {

      try {
        countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ? AND admin = 0', name))[0]
        if (countName.count > 0) {
          return { status: false, code: CLIENT_ERROR }
        }
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

      return { status: true, code: SUCCESS }

    }

    if (!excludeAdmin && excludeId !== false) {

      try {
        countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ? AND id = ?', [name, excludeId]))[0]
        if (countName.count > 0) {
          return { status: false, code: CLIENT_ERROR }
        }
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

      return { status: true, code: SUCCESS }

    }

    if (excludeAdmin && excludeId !== false) {

      try {
        countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ? AND admin = 1 AND id = ?', [name, excludeId]))[0]
        if (countName.count > 0) {
          return { status: false, code: CLIENT_ERROR }
        }
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

      return { status: true, code: SUCCESS }

    }

    try {
      countName = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users WHERE name = ?', name))[0]
      if (countName.count > 0) {
        return { status: false, code: CLIENT_ERROR }
      }
    } catch (error: any) {
      return { status: false, code: DB_ERROR, message: error.code }
    }

    return { status: true, code: SUCCESS }

  }

  /**
   * Check is the name is available before with `await new Auth().isNameAvailable()`!
   *
   * `user`'s password must be hashed.
   */
  async insertUser(user: User): Promise<DataServiceResponse<{ id: number }>> {

    let insertUser: ResultSetHeader

    try {
      insertUser = await db.query<ResultSetHeader>(
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
    } catch (error: any) {
      return { status: false, code: DB_ERROR, message: error.code }
    }

    return { status: true, code: SUCCESS, data: { id: insertUser.insertId } }

  }


  async checkAuth(auth: string, type: 'Basic' | 'Bearer' | null = null): Promise<DataServiceResponse<User>> {

    if (!auth.startsWith('Basic ') && !auth.startsWith('Bearer ')) {
      return { status: false, code: AUTH_ERROR }
    }

    if (type && auth.split(' ')[0] != type) {
      return { status: false, code: AUTH_ERROR }
    }

    var user: User | null | undefined

    if (auth.startsWith('Basic')) {

      const [name, password] = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii').split(':')

      try {
        user = (await db.query<User[]>('SELECT * FROM users WHERE name = ?', [name]))[0]
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

      if (!user || !user.name || !(await bcrypt.compare(password, user.password + ''))) {
        return { status: false, code: AUTH_ERROR }
      }

      return { status: true, code: SUCCESS, data: user }

    }

    if (auth.startsWith('Bearer ')) {

      const dec = await jwt.verify(auth.split(' ')[1])

      if (!dec[0]) {
        if (dec[1] == 401) {
          return { status: false, code: AUTH_ERROR, message: dec[2] }
        } else if (dec[1] == 500) {
          return { status: false, code: DB_ERROR }
        } else {
          return { status: false, code: UNKNOWN_ERROR }
        }
      } else if (!jwt.isJwtPayload(dec[1])) {
        return { status: false, code: AUTH_ERROR }
      }

      try {
        user = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', [dec[1].sub]))[0]
      } catch (error: any) {
        return { status: false, code: AUTH_ERROR }
      }

      if (!user || !user.name) {
        return { status: false, code: AUTH_ERROR }
      }

      return { status: true, code: SUCCESS, data: user }

    }

    return { status: false, code: AUTH_ERROR }

  }

}
