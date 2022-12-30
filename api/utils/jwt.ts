import { UserJWT } from "../types/user"
import { query } from './database'
import jwt from 'jsonwebtoken'

export async function jwtVerify(token: string): Promise<[true, UserJWT | string] | [false, number, string]> {
  const secret_key = process.env['JWT_SECRET_KEY']
  var decoded: UserJWT | string
  var [isJwt]: any = []

  try {
    decoded = jwt.verify(token, secret_key + '')
  } catch (error: any) {
  if (error.message == 'jwt expired') {
      return [false, 401, 'Token expired']
    } else {
      return [false, 401, 'Unauthorized']
    }
  }

  try {
    [isJwt] = await query('SELECT COUNT(*) AS count FROM exp_jwt WHERE jwt = ?', [token])
  } catch (error: any) {
    return [false, 400, 'Unknown']
  }

  if (isJwt.count > 0) {
    return [false, 401, 'Token expired']
  }

  return [true, decoded]
}
