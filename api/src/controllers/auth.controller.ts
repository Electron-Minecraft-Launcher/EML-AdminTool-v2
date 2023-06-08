import db from '$utils/database'
import { AuthService } from '$services/auth.service'
import pin_ from '$utils/pin'
import bcrypt from 'bcrypt'
import { User } from '$models/features/user.model'
import { CLIENT_ERROR, DB_ERROR, SUCCESS } from '$models/types'
import { DBException } from '$responses/exceptions/db-exception.response'
import { DataSuccess } from '$responses/success/data-success.response'
import { NextFunction } from 'express'
import { IncomingHttpHeaders } from 'http'
import { DefaultSuccess } from '$responses/success/default-success.response'
import { RequestException } from '$responses/exceptions/request-exception.response'
import { UnauthorizedException } from '$responses/exceptions/unauthorized-exception.response'
import { DataServiceResponse } from '$models/responses/services/data-service-response.model'
import jwt from '$utils/jwt'
import nexter from '$utils/nexter'

class Auth {
  async auth(headers: IncomingHttpHeaders, next: NextFunction): Promise<DataSuccess<{ jwt: string; user: User }>> {
    const auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + '', 'Basic'))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    var user: User = auth.data!

    delete user.password
    delete user.status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: jwt.generate(user), user: user })
  }

  async verify(headers: IncomingHttpHeaders, next: NextFunction): Promise<DataSuccess<{ jwt: string; user: User }>> {
    const auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + '', 'Bearer'))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    var user: User = auth.data!
    const token = (headers['authorization'] + '').split(' ')[1]

    delete user.password
    delete user.status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: token, user: user })
  }

  async register(body: any, next: NextFunction): Promise<DataSuccess<{ jwt: string; user: User }>> {
    if (!body.name || body.name == '' || !body.password || body.password == '' || !body.pin) {
      next(new RequestException('Missing parameters'))
      throw null
    }

    const name = body.name
    const password = { clear: body.password, hash: await bcrypt.hash(body.password, 10) }
    const pin = body.pin

    const user: User = {
      name: name,
      password: password.hash,
      status: 0,
      admin: 0,
      p_files_updater_add_del: 0,
      p_bootstrap_mod: 0,
      p_maintenance_mod: 0,
      p_news_add: 0,
      p_news_mod_del: 0,
      p_news_category_add_mod_del: 0,
      p_news_tag_add_mod_del: 0,
      p_background_mod: 0,
      p_stats_del: 0,
    }

    var isNameAvailable = (await new AuthService().isNameAvailable(name)).code

    if (isNameAvailable == CLIENT_ERROR) {
      next(new UnauthorizedException('Name used'))
      throw null
    } else if (isNameAvailable == DB_ERROR) {
      next(new DBException())
      throw null
    }

    let addUser: DataServiceResponse<{ id: number }>

    if (pin != (await pin_.get())) {
      user.status = -1
      addUser = await new AuthService().insertUser(user)
      if (addUser.code == DB_ERROR) {
        next(new DBException())
        throw null
      }
    } else {
      addUser = await new AuthService().insertUser(user)
      if (addUser.code == DB_ERROR) {
        next(new DBException())
        throw null
      }
    }

    user.id = addUser.data?.id
    delete user.password
    delete user.status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: jwt.generate(user), user: user })
  }

  async logout(headers: IncomingHttpHeaders, next: NextFunction): Promise<DefaultSuccess> {
    const auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + '', 'Bearer'))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    const token = (headers['authorization'] + '').split(' ')[1]

    try {
      await db.query<User[]>('INSERT INTO exp_jwt (jwt) VALUES (?)', [token])
    } catch (error: any) {
      next(new DBException())
      throw null
    }

    return new DefaultSuccess()
  }
}

export default Auth
