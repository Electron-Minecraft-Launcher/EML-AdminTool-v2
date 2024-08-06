import { User } from '../../../shared/types/features/user'
import db from '../utils/db'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { count } from '../../../shared/types/types'

class JWTService {
  async verify(token: string): Promise<[true, JwtPayload | string] | [false, number, string]> {
    const secretKey = process.env['JWT_SECRET_KEY'] + ''
    var decoded: JwtPayload | string
    var isJwt: count

    try {
      decoded = jwt.verify(token, secretKey)
    } catch (error: any) {
      if (error.message == 'jwt expired') {
        return [false, 401, 'Token expired']
      } else {
        return [false, 401, 'Unauthorized']
      }
    }

    try {
      isJwt = (await db.query<count[]>('SELECT COUNT(*) AS count FROM exp_jwt WHERE jwt = ?', [token]))[0]
    } catch (error: any) {
      return [false, 500, 'DataBase']
    }

    if (isJwt.count > 0) {
      return [false, 401, 'Token expired']
    }

    return [true, decoded]
  }

  generate(user: User): string {
    const secretKey = process.env['JWT_SECRET_KEY'] + ''

    return jwt.sign(
      {
        name: user.name + '',
        admin: +user.admin!,
        p_files_updater_add_del: +user.p_files_updater_add_del!,
        p_files_updater_loader_mod: +user.p_files_updater_loader_mod!,
        p_bootstraps_mod: +user.p_bootstraps_mod!,
        p_maintenance_mod: +user.p_maintenance_mod!,
        p_news_add: +user.p_news_add!,
        p_news_mod_del: +user.p_news_mod_del!,
        p_news_categories_add_mod_del: +user.p_news_categories_add_mod_del!,
        p_news_tags_add_mod_del: +user.p_news_tags_add_mod_del!,
        p_background_mod: +user.p_background_mod!,
        p_stats_see: +user.p_stats_see!,
        p_stats_del: +user.p_stats_del!
      },
      secretKey,
      { subject: user.id + '', expiresIn: '30 days', algorithm: 'HS256' }
    )
  }

  isJwtPayload(object: any): object is JwtPayload {
    return 'exp' in object && 'iat' in object
  }
}

export default new JWTService()
