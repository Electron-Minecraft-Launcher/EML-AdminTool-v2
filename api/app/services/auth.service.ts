import { User, UserJWT } from '../models/features/user.model'
import { query } from '../utils/database'
import { RowDataPacket } from 'mysql2'
import bcrypt from 'bcrypt'
import { jwtVerify } from '../utils/jwt'
import { DefaultServiceResponse } from '../models/responses/services/default-service-response.model'
import { AUTH_ERROR, DB_ERROR, SUCCESS } from '../models/types'

export class Auth {

  public async isAdmin(auth: string | undefined): Promise<DefaultServiceResponse> {


    if (auth && auth.startsWith('Basic ')) {
      const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii')
      const [name, password] = credentials.split(':')
      var user: User[] | null
      try {
        user = await query<User[] & RowDataPacket[]>('SELECT * FROM users WHERE name = ? AND admin = 1', [name])
      } catch (error: any) {
        return { status: false, code: DB_ERROR, message: error.code }
      }

      if (user[0] && user[0].name && await bcrypt.compare(password, user[0].password + '')) {
        return { status: true, code: SUCCESS }
      } else {
        return { status: false, code: AUTH_ERROR }
      }

    } else if (auth && auth.startsWith('Bearer ')) {

      const resp: [true, string | UserJWT] | [false, number, string] = await jwtVerify(auth.split(' ')[1])

      if (resp[0] && typeof resp[1] == 'object') {
        var jwt = resp[1]
        if (jwt.admin) {
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

}
