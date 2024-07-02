import { ResultSetHeader } from 'mysql2'
import { User } from '../../../shared/models/features/user.model'
import { DataServiceResponse } from '../../../shared/models/responses/services/data-service-response.model'
import { DefaultServiceResponse } from '../../../shared/models/responses/services/default-service-response.model'
import { ResponseType, count } from '../../../shared/models/types'
import db from '../utils/db'

class AdminService {
  async isNameAvailable(name: string, excludeAdmin: boolean = false, excludeId: number | false = false): Promise<DefaultServiceResponse> {
    const query =
      excludeAdmin && !excludeId
        ? 'SELECT COUNT(*) AS count FROM users WHERE name = ? AND admin = 0'
        : !excludeAdmin && excludeId
          ? 'SELECT COUNT(*) AS count FROM users WHERE name = ? AND id = ?'
          : excludeAdmin && excludeId
            ? 'SELECT COUNT(*) AS count FROM users WHERE name = ? AND admin = 1 AND id = ?'
            : 'SELECT COUNT(*) AS count FROM users WHERE name = ?'

    const params =
      excludeAdmin && !excludeId
        ? [name]
        : !excludeAdmin && excludeId
          ? [name, excludeId]
          : excludeAdmin && excludeId
            ? [name, excludeId]
            : [name]

    try {
      if ((await db.query<count[]>(query, params))[0].count > 0) {
        return { status: false, code: ResponseType.CLIENT_ERROR, message: 'Name already used' }
      }
    } catch (error: any) {
      return { status: false, code: ResponseType.DATABASE_ERROR, message: error.code }
    }

    return { status: true, code: ResponseType.SUCCESS }
  }

  /**
   * Check if the name is available before with `await new Auth().isNameAvailable()`!
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
          p_bootstraps_mod,
          p_maintenance_mod,
          p_news_add,
          p_news_mod_del,
          p_news_categories_add_mod_del,
          p_news_tags_add_mod_del,
          p_background_mod,
          p_stats_see,
          p_stats_del
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.name + '',
          user.password + '',
          user.status || 0,
          user.admin || 0,
          user.p_files_updater_add_del || 0,
          user.p_bootstraps_mod || 0,
          user.p_maintenance_mod || 0,
          user.p_news_add || 0,
          user.p_news_mod_del || 0,
          user.p_news_categories_add_mod_del || 0,
          user.p_news_tags_add_mod_del || 0,
          user.p_background_mod || 0,
          user.p_stats_see || 0,
          user.p_stats_del || 0
        ]
      )
    } catch (error: any) {
      return { status: false, code: ResponseType.DATABASE_ERROR, message: error.code }
    }

    return { status: true, code: ResponseType.SUCCESS, data: { id: insertUser.insertId } }
  }

  async updateUser(user: User): Promise<DataServiceResponse<{ id: number }>> {
    let updateUser: ResultSetHeader

    try {
      updateUser = await db.query<ResultSetHeader>(
        `UPDATE users SET
        name = ?,
        password = ?,
        status = ?,
        p_files_updater_add_del = ?,
        p_bootstraps_mod = ?,
        p_maintenance_mod = ?,
        p_news_add = ?,
        p_news_mod_del = ?,
        p_news_categories_add_mod_del = ?,
        p_news_tags_add_mod_del = ?,
        p_background_mod = ?,
        p_stats_see = ?,
        p_stats_del = ?
        WHERE id = ?`,
        [
          user.name + '',
          user.password + '',
          user.status || 0,
          user.p_files_updater_add_del || 0,
          user.p_bootstraps_mod || 0,
          user.p_maintenance_mod || 0,
          user.p_news_add || 0,
          user.p_news_mod_del || 0,
          user.p_news_categories_add_mod_del || 0,
          user.p_news_tags_add_mod_del || 0,
          user.p_background_mod || 0,
          user.p_stats_see || 0,
          user.p_stats_del || 0,
          user.id!
        ]
      )
    } catch (error: any) {
      return { status: false, code: ResponseType.DATABASE_ERROR, message: error.code }
    }

    return { status: true, code: ResponseType.SUCCESS, data: { id: updateUser.insertId } }
  }
}

export default new AdminService()
