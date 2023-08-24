import db from '$utils/database'
import { AuthService } from '$services/auth.service'
import pin_ from '$utils/pin'
import bcrypt from 'bcrypt'
import { User } from '$models/features/user.model'
import { DB_ERROR, SUCCESS, ServiceException } from '$models/types'
import { DBException } from '$responses/exceptions/db-exception.response'
import { DataSuccess } from '$responses/success/data-success.response'
import { IncomingHttpHeaders } from 'http'
import { DefaultSuccess } from '$responses/success/default-success.response'
import { RequestException } from '$responses/exceptions/request-exception.response'
import { DataServiceResponse } from '$models/responses/services/data-service-response.model'
import jwt from '$utils/jwt'
import nexter from '$utils/nexter'

export default class Auth {
  async auth(headers: IncomingHttpHeaders): Promise<DataSuccess<{ jwt: string; user: User }>> {
    try {
      var user = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + '', 'Basic'))
    } catch (error) {
      throw error as ServiceException
    }

    delete user.password
    delete user.status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: jwt.generate(user), user })
  }

  async verify(headers: IncomingHttpHeaders): Promise<DataSuccess<{ jwt: string; user: User }>> {
    try {
      var user = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + '', 'Bearer'))
    } catch (error) {
      throw error as ServiceException
    }

    const jwt = (headers['authorization'] + '').split(' ')[1]

    delete user.password
    delete user.status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt, user })
  }

  async register(body: any): Promise<DataSuccess<{ jwt: string; user: User }>> {
    if (!body.name || body.name == '' || !body.password || body.password == '' || !body.pin) {
      throw new RequestException('Missing parameters')
    }

    const name = body.name
    const password = { clear: body.password, hash: await bcrypt.hash(body.password, 10) }
    const pin = body.pin

    let user: User = {
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
      p_stats_see: 0,
      p_stats_del: 0
    }

    try {
      nexter.serviceToException(await new AuthService().isNameAvailable(name))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (pin != (await pin_.get())) {
      user.status = -1
    }

    try {
      var newUser = nexter.serviceToException(await new AuthService().insertUser(user))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    user.id = newUser.id
    delete user.password
    delete user.status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: jwt.generate(user), user })
  }

  async logout(headers: IncomingHttpHeaders): Promise<DefaultSuccess> {
    try {
      nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + '', 'Bearer'))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    const token = (headers['authorization'] + '').split(' ')[1]

    try {
      await db.query<User[]>('INSERT INTO exp_jwt (jwt) VALUES (?)', [token])
    } catch (error: any) {
      throw new DBException()
    }

    return new DefaultSuccess()
  }
}
