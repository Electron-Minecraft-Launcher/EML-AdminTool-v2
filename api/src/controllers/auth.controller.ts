import { Request } from 'express'
import bcrypt from 'bcrypt'
import { IncomingHttpHeaders } from 'http'
import { User } from '../../../shared/types/features/user'
import { DBException } from '../responses/exceptions/db-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import { DataSuccess } from '../responses/success/data-success.response'
import { DefaultSuccess } from '../responses/success/default-success.response'
import { ServiceException } from '../responses/types'
import db from '../utils/db'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ResponseType } from '../../../shared/types/types'
import jwtService from '../services/jwt.service'
import adminService from '../services/admin.service'
import pinService from '../services/pin.service'

export default class Auth {
  async auth(req: Request<any>, headers: IncomingHttpHeaders): Promise<DataSuccess<{ jwt: string; user: User }>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + '', 'Basic'))
    } catch (error) {
      throw error as ServiceException
    }

    delete auth.password
    delete auth.status

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { jwt: jwtService.generate(auth), user: auth })
  }

  async verify(req: Request<any>, headers: IncomingHttpHeaders): Promise<DataSuccess<{ jwt: string; user: User }>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + '', 'Bearer'))
    } catch (error) {
      throw error as ServiceException
    }

    const jwt = (headers['authorization'] + '').split(' ')[1]

    delete auth.password
    delete auth.status

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { jwt, user: auth })
  }

  async register(req: Request<any>, body: any): Promise<DataSuccess<{ jwt: string; user: User }>> {
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
      p_files_updater_loader_mod: 0,
      p_bootstraps_mod: 0,
      p_maintenance_mod: 0,
      p_news_add: 0,
      p_news_mod_del: 0,
      p_news_categories_add_mod_del: 0,
      p_news_tags_add_mod_del: 0,
      p_background_mod: 0,
      p_stats_see: 0,
      p_stats_del: 0
    }

    try {
      nexter.serviceToException(await adminService.isNameAvailable(name))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (pin != (await pinService.get())) {
      user.status = -1
    }

    try {
      var newUser = nexter.serviceToException(await adminService.insertUser(user))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    user.id = newUser.id
    delete user.password
    delete user.status

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { jwt: jwtService.generate(user), user })
  }

  async logout(req: Request<any>, headers: IncomingHttpHeaders): Promise<DefaultSuccess> {
    try {
      nexter.serviceToException(await authService.checkAuth(headers['authorization'] + '', 'Bearer'))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    const token = (headers['authorization'] + '').split(' ')[1]

    try {
      await db.query<User[]>('INSERT INTO exp_jwt (jwt) VALUES (?)', [token])
    } catch (error: any) {
      throw new DBException()
    }

    return new DefaultSuccess(req)
  }
}
