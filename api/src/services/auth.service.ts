import { User } from '../../../shared/models/features/user.model'
import { DataServiceResponse } from '../../../shared/models/responses/services/data-service-response.model'
import { DefaultServiceResponse } from '../../../shared/models/responses/services/default-service-response.model'
import { ResponseType } from '../../../shared/models/types'
import bcrypt from 'bcrypt'
import jwtService from './jwt.service'
import db from '../utils/db'

class AuthService {
  /**
   * @param auth Auth string including `Basic` or `Bearer`.
   */
  async isAdmin(auth: string): Promise<DefaultServiceResponse> {
    let auth_ = await this.checkAuth(auth + '')

    if (!auth_.status) {
      return auth_
    }

    if (!auth_.data?.admin) {
      return { status: false, code: ResponseType.AUTH_ERROR }
    }

    return { status: true, code: ResponseType.SUCCESS }
  }

  async checkAuth(auth: string, type: 'Basic' | 'Bearer' | null = null): Promise<DataServiceResponse<User>> {
    if (!auth.startsWith('Basic ') && !auth.startsWith('Bearer ')) {
      return { status: false, code: ResponseType.AUTH_ERROR }
    }

    if (type && auth.split(' ')[0] != type) {
      return { status: false, code: ResponseType.AUTH_ERROR }
    }

    let user: User | null | undefined

    if (auth.startsWith('Basic')) {
      const [name, password] = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii').split(':')

      try {
        user = (await db.query<User[]>('SELECT * FROM users WHERE name = ? AND status != -2', [name]))[0]
      } catch (error: any) {
        return { status: false, code: ResponseType.DATABASE_ERROR, message: error.code }
      }

      if (!user || !user.name || !(await bcrypt.compare(password, user.password + ''))) {
        return { status: false, code: ResponseType.AUTH_ERROR }
      }

      return { status: true, code: ResponseType.SUCCESS, data: user }
    }

    if (auth.startsWith('Bearer ')) {
      const dec = await jwtService.verify(auth.split(' ')[1])

      if (!dec[0]) {
        if (dec[1] == 401) {
          return { status: false, code: ResponseType.AUTH_ERROR, message: dec[2] }
        } else if (dec[1] == 500) {
          return { status: false, code: ResponseType.DATABASE_ERROR }
        } else {
          return { status: false, code: ResponseType.UNKNOWN_ERROR }
        }
      } else if (!jwtService.isJwtPayload(dec[1])) {
        return { status: false, code: ResponseType.AUTH_ERROR }
      }

      try {
        user = (await db.query<User[]>('SELECT * FROM users WHERE id = ? AND status != -2', [dec[1].sub]))[0]
      } catch (error: any) {
        return { status: false, code: ResponseType.AUTH_ERROR }
      }

      if (!user || !user.name) {
        return { status: false, code: ResponseType.AUTH_ERROR }
      }

      return { status: true, code: ResponseType.SUCCESS, data: user }
    }

    return { status: false, code: ResponseType.AUTH_ERROR }
  }
}

export default new AuthService()