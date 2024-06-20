import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'
import { EMLAdminToolInfo } from '../../../shared/models/features/emlat-info.model'
import { User } from '../../../shared/models/features/user.model'
import { DataServiceResponse } from '../../../shared/models/responses/services/data-service-response.model'
import { ResponseType, count } from '../../../shared/models/types'
import { DBException } from '../responses/exceptions/db-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { DataSuccess } from '../responses/success/data-success.response'
import { DefaultSuccess } from '../responses/success/default-success.response'
import { ServiceException } from '../responses/types'
import db from '../utils/db'
import authService from '../services/auth.service'
import nexter from '../utils/nexter'
import envService from '../services/env.service'
import vpsService from '../services/vps.service'
import adminService from '../services/admin.service'
import pinService from '../services/pin.service'
import languageService from '../services/language.service'
import bcrypt from 'bcrypt'

export default class Admin {
  async getAdminToolInfo(req: Request<any>, headers: IncomingHttpHeaders): Promise<DataSuccess<EMLAdminToolInfo>> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    var env_ = await envService.getEnv()
    var pin: string = ''
    var countUsers: count

    try {
      pin = (await db.query<string[]>("SELECT value FROM config WHERE data = 'pin'"))[0].value
    } catch (error) {
      throw new DBException()
    }

    try {
      countUsers = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users'))[0]
    } catch (error) {
      throw new DBException()
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', {
      emlat: { ...env_, pin, nbUsers: countUsers.count },
      vps: { os: vpsService.getOS(), storage: vpsService.getStorage() },
      users: await this.getUsers(req, headers).then((res) => res.data)
    })
  }

  async putAdminToolInfo(req: Request<any>, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<EMLAdminToolInfo>> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    var getUser: User
    var pin: string = ''
    var countUsers: count

    if (body.name != '' && body.name != null) {
      try {
        getUser = (await db.query<User[]>('SELECT * FROM users WHERE admin = 1'))[0]
      } catch (error) {
        throw new DBException()
      }

      var isNameAvailable = (await adminService.isNameAvailable(body.name)).code

      if (isNameAvailable == ResponseType.CLIENT_ERROR) {
        throw new UnauthorizedException('Name used')
      } else if (isNameAvailable == ResponseType.DATABASE_ERROR) {
        throw new DBException()
      }

      getUser.name = body.name

      let updateUser: DataServiceResponse<{ id: number }> = await adminService.updateUser(getUser)

      if (!updateUser.status) {
        throw new DBException()
      }
    }

    try {
      countUsers = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users'))[0]
    } catch (error) {
      throw new DBException()
    }

    if (body.pin && body.pin != 'false') {
      try {
        pin = (await pinService.check(true)) + ''
      } catch (error) {
        throw new DBException()
      }
    }

    if (body.language) {
      const language = body.language == 'fr' ? 'fr' : 'en'

      try {
        await languageService.check(language)
      } catch (error) {
        throw new DBException()
      }
    }

    var env_ = await envService.getEnv()

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', {
      emlat: { ...env_, pin, nbUsers: countUsers.count },
      vps: { os: vpsService.getOS(), storage: vpsService.getStorage() },
      users: []
    })
  }

  async getUsers(req: Request<any>, headers: IncomingHttpHeaders): Promise<DataSuccess<User[]>> {
    try {
      nexter.serviceToException(await authService.isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    let users = await db.query<User[]>('SELECT * FROM users')

    users.forEach((user, i) => {
      delete users[i].password
    })

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', users)
  }

  async getUser(req: Request<any>, headers: IncomingHttpHeaders, userId: number | 'me'): Promise<DataSuccess<User>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    var user = auth
    var getUser: User

    if (userId == user.id || userId == 'me') {
      userId = user.id!
    } else if (!user.admin) {
      throw new UnauthorizedException()
    }

    try {
      getUser = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', [userId]))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!getUser) {
      throw new RequestException('User does not exist')
    }

    delete getUser.password

    if (!user.admin) delete getUser.status

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', getUser)
  }

  async putUser(req: Request<any>, headers: IncomingHttpHeaders, body: any, userId: number | 'me'): Promise<DataSuccess<{ jwt?: string; user: User }>> {
    try {
      var user = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!userId) {
      throw new RequestException('Missing parameters')
    }

    let getUser: User
    const token = (headers['authorization'] + '').split(' ')[1]

    if (userId == user.id || userId == 'me') {
      userId = user.id!
    } else if (!user.admin) {
      throw new UnauthorizedException()
    }

    try {
      getUser = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', +userId))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!getUser) {
      throw new RequestException('User does not exist')
    }

    let updatedUser: User = {
      id: userId,
      name: body.name || getUser.name,
      password: getUser.password,
      admin: getUser.admin,
      status: ((user.admin && body.status) || (body.status && body.status == -2)) && !getUser.admin ? +body.status : getUser.status,
      p_files_updater_add_del: user.admin && +body.p_files_updater_add_del ? 1 : 0,
      p_bootstrap_mod: user.admin && body.p_bootstrap_mod ? +body.p_bootstrap_mod : getUser.p_bootstrap_mod,
      p_maintenance_mod: user.admin && body.p_maintenance_mod ? +body.p_maintenance_mod : getUser.p_maintenance_mod,
      p_news_add: user.admin && body.p_news_add ? +body.p_news_add : getUser.p_news_add,
      p_news_mod_del: user.admin && body.p_news_mod_del ? +body.p_news_mod_del : getUser.p_news_mod_del,
      p_news_category_add_mod_del:
        user.admin && body.p_news_category_add_mod_del ? +body.p_news_category_add_mod_del : getUser.p_news_category_add_mod_del,
      p_news_tag_add_mod_del: user.admin && body.p_news_tag_add_mod_del ? +body.p_news_tag_add_mod_del : getUser.p_news_tag_add_mod_del,
      p_background_mod: user.admin && body.p_background_mod ? +body.p_background_mod : getUser.p_background_mod,
      p_stats_see: user.admin && body.p_stats_see ? +body.p_stats_see : getUser.p_stats_see,
      p_stats_del: user.admin && body.p_stats_del ? +body.p_stats_del : getUser.p_stats_del
    }

    if (getUser.admin) {
      updatedUser.admin = 1
      updatedUser.status = 1
      updatedUser.p_files_updater_add_del = 1
      updatedUser.p_bootstrap_mod = 1
      updatedUser.p_maintenance_mod = 1
      updatedUser.p_news_add = 1
      updatedUser.p_news_mod_del = 1
      updatedUser.p_news_category_add_mod_del = 1
      updatedUser.p_news_tag_add_mod_del = 1
      updatedUser.p_background_mod = 1
      updatedUser.p_stats_see = 1
      updatedUser.p_stats_del = 1
    }

    if (userId == user.id && body.password != null && body.password != '') {
      updatedUser.password = await bcrypt.hash(body.password, 10)
    }

    if (body.name && body.name !== getUser.name) {
      try {
        nexter.serviceToException(await adminService.isNameAvailable(body.name))
      } catch (error: unknown) {
        throw error as ServiceException
      }
    }

    try {
      nexter.serviceToException(await adminService.updateUser(updatedUser))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    delete updatedUser.password
    if (!user.admin) {
      delete updatedUser.status
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { jwt: userId == user.id ? token : undefined, user: updatedUser })
  }

  async deleteUser(req: Request<any>, headers: IncomingHttpHeaders, userId: number | 'me'): Promise<DefaultSuccess> {
    try {
      var user = nexter.serviceToException(await authService.checkAuth(req.headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    var getUser: User

    if (userId == user.id || userId == 'me') {
      userId = user.id!
    } else if (!user.admin) {
      throw new UnauthorizedException()
    }

    try {
      getUser = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', +userId))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!getUser) {
      throw new RequestException('User does not exist')
    }

    if (getUser.admin) {
      throw new RequestException('Not allowed to delete admin')
    }

    try {
      await db.query('DELETE FROM users WHERE id = ?', +userId)
      await db.query('DELETE FROM logs WHERE user = ?', +userId)
      await db.query('DELETE FROM news WHERE author = ?', +userId)
    } catch (error) {
      throw new DBException()
    }

    return new DefaultSuccess(req, 200, ResponseType.SUCCESS, 'Success')
  }
}
