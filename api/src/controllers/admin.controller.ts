import { NextFunction } from 'express'
import bcrypt from 'bcrypt'
import db from '$utils/database'
import { IncomingHttpHeaders } from 'http'
import { AuthService } from '$services/auth.service'
import { User } from '$models/features/user.model'
import { CLIENT_ERROR, Code, DB_ERROR, SUCCESS, ServiceException, UNKNOWN_ERROR, count } from '$models/types'
import { DBException } from '$responses/exceptions/db-exception.response'
import { DataSuccess } from '$responses/success/data-success.response'
import { DefaultSuccess } from '$responses/success/default-success.response'
import { RequestException } from '$responses/exceptions/request-exception.response'
import { UnauthorizedException } from '$responses/exceptions/unauthorized-exception.response'
import { DataServiceResponse } from '$models/responses/services/data-service-response.model'
import nexter from '$utils/nexter'
import { EnvService } from '$services/env.service'
import vps from '$utils/vps'
import { EMLAdminToolInfo } from '$models/features/emlat-info.model'
import pin_ from '$utils/pin'
import language_ from '$utils/language'

export default class Admin {
  async getAdminToolInfo(headers: IncomingHttpHeaders): Promise<DataSuccess<EMLAdminToolInfo>> {
    try {
      nexter.serviceToException(await new AuthService().isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    var env = await new EnvService().getEnv()
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

    return new DataSuccess(200, SUCCESS, 'Success', {
      emlat: { ...env, pin, nbUsers: countUsers.count },
      vps: { os: vps.getOS(), storage: vps.getStorage() },
      users: []
    })
  }

  async putAdminToolInfo(headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<EMLAdminToolInfo>> {
    try {
      nexter.serviceToException(await new AuthService().isAdmin(headers['authorization'] + ''))
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

      var isNameAvailable = (await new AuthService().isNameAvailable(body.name)).code

      if (isNameAvailable == CLIENT_ERROR) {
        throw new UnauthorizedException('Name used')
      } else if (isNameAvailable == DB_ERROR) {
        throw new DBException()
      }

      getUser.name = body.name

      let updateUser: DataServiceResponse<{ id: number }> = await new AuthService().updateUser(getUser)

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
        pin = (await pin_.check(true)) + ''
      } catch (error) {
        throw new DBException()
      }
    }

    if (body.language) {
      const language = body.language == 'fr' ? 'fr' : 'en'

      try {
        await language_.set(language)
      } catch (error) {
        throw new DBException()
      }
    }

    var env = await new EnvService().getEnv()

    return new DataSuccess(200, SUCCESS, 'Success', {
      emlat: { ...env, pin, nbUsers: countUsers.count },
      vps: { os: vps.getOS(), storage: vps.getStorage() },
      users: []
    })
  }

  async getUsers(headers: IncomingHttpHeaders): Promise<DataSuccess<User[]>> {
    try {
      nexter.serviceToException(await new AuthService().isAdmin(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    let users = await db.query<User[]>('SELECT * FROM users')

    users.forEach((user, i) => {
      delete users[i].password
    })

    return new DataSuccess(200, SUCCESS, 'Success', users)
  }

  async getUser(headers: IncomingHttpHeaders, userId: number | 'me'): Promise<DataSuccess<User>> {
    try {
      var auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + ''))
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

    return new DataSuccess(200, SUCCESS, 'Success', getUser)
  }

  async putUser(headers: IncomingHttpHeaders, body: any, userId: number | 'me'): Promise<DataSuccess<{ jwt?: string; user: User }>> {
    try {
      var user = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!userId) {
      throw new RequestException('Missing parameters')
    }

    var getUser: User
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
      p_files_updater_add_del: user.admin && body.p_files_updater_add_del ? +body.p_files_updater_add_del : getUser.p_files_updater_add_del,
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
        nexter.serviceToException(await new AuthService().isNameAvailable(body.name))
      } catch (error: unknown) {
        throw error as ServiceException
      }
    }

    try {
      nexter.serviceToException(await new AuthService().updateUser(updatedUser))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    delete updatedUser.password
    if (!user.admin) {
      delete updatedUser.status
    }

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: userId == user.id ? token : undefined, user: updatedUser })
  }

  async deleteUser(headers: IncomingHttpHeaders, userId: number | 'me'): Promise<DefaultSuccess> {
    try {
      var user = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + ''))
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
    } catch (error) {
      throw new DBException()
    }

    return new DefaultSuccess(200, SUCCESS, 'Success')
  }
}
