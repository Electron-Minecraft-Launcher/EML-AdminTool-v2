import { User, UserJWT } from "../models/features/user.model"
import db from './database'
import jwt from 'jsonwebtoken'
import { count } from "../models/types"

class JWT {

  async verify(token: string): Promise<[true, UserJWT | string] | [false, number, string]> {
    const secretKey = process.env['JWT_SECRET_KEY']
    var decoded: UserJWT | string
    var isJwt: count

    try {
      decoded = jwt.verify(token, secretKey + '')
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
      return [false, 500, 'Unknown']
    }

    if (isJwt.count > 0) {
      return [false, 401, 'Token expired']
    }

    return [true, decoded]
  }

  generate(user: User): string {

    const secretKey = process.env['JWT_SECRET_KEY'] + ''

    return jwt.sign({
      name: user.name + '',
      admin: user.admin! + 0
    }, secretKey, { subject: user.id + '', expiresIn: '30 days' })

  }

}

export default new JWT()
