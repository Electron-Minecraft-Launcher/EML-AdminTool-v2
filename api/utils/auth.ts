import { User, UserJWT } from '../types/user'
import { query } from './database'
import { RowDataPacket } from 'mysql2'
import bcrypt from 'bcrypt'
import { jwtVerify } from './jwt'
import { ModelResponse } from 'api/types/response'

export class Auth {

  public async isAdmin(auth: string | undefined): Promise<[true] | [false, ModelResponse<null>]> {


    if (auth && auth.startsWith('Basic ')) {
      const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii')
      const [name, password] = credentials.split(':')
      var user: User[] | null
      try {
        user = await query<User[] & RowDataPacket[]>('SELECT * FROM users WHERE name = ? AND admin = 1', [name])
      } catch (error: any) {
        return [false, { code: 400, message: error.code }]
      }

      if (user[0] && user[0].name && await bcrypt.compare(password, user[0].password + '')) {
        return [true]
      } else {
        return [false, { code: 401, message: 'Unauthorized' }]
      }

    } else if (auth && auth.startsWith('Bearer ')) {

      const resp: [true, string | UserJWT] | [false, number, string] = await jwtVerify(auth.split(' ')[1])

      if (resp[0] && typeof resp[1] == 'object') {
        var jwt = resp[1]
        if (jwt.admin) {
          return [true]
        } else {
          return [false, { code: 401, message: 'Unauthorized' }]
        }
      } else {
        return [false, { code: 401, message: 'Unauthorized' }]
      }

    } else {
      return [false, { code: 401, message: 'Unauthorized' }]
    }


  }

}
