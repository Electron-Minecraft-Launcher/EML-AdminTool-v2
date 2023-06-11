import { NextFunction } from 'express'
import bcrypt from 'bcrypt'
import db from '$utils/database'
import { IncomingHttpHeaders } from 'http'
import { AuthService } from '$services/auth.service'
import { User } from '$models/features/user.model'
import { CLIENT_ERROR, Code, DB_ERROR, SUCCESS, UNKNOWN_ERROR, count } from '$models/types'
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

class Admin {
  async getAdminToolInfo(headers: IncomingHttpHeaders, next: NextFunction): Promise<DataSuccess<EMLAdminToolInfo>> {
    const auth = nexter.serviceToException(await new AuthService().isAdmin(headers['authorization'] + ''))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    var env = await new EnvService().getEnv()
    var pin: string = ''
    var countUsers: count

    try {
      pin = (await db.query<string[]>("SELECT value FROM config WHERE data = 'pin'"))[0].value
    } catch (error) {
      next(new DBException())
      throw null
    }

    try {
      countUsers = (await db.query<count[]>('SELECT COUNT(*) AS count FROM users'))[0]
    } catch (error) {
      next(new DBException())
      throw null
    } 

    return new DataSuccess(200, SUCCESS, 'Success', {
      emlat: { ...env, pin, nbUsers: countUsers.count },
      vps: { os: vps.getOS(), storage: vps.getStorage() },
    })
  }

  async getUsers(headers: IncomingHttpHeaders, next: NextFunction): Promise<DataSuccess<User[]>> {
    const auth = nexter.serviceToException(await new AuthService().isAdmin(headers['authorization'] + ''))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    let users: User[] = await db.query<User[]>('SELECT * FROM users')
    let users_: User[] = []

    for (let user of users) {
      delete user.password
      users_.push(user)
    }

    return new DataSuccess(200, SUCCESS, 'Success', users_)
  }

  async getUser(headers: IncomingHttpHeaders, userId: number | 'me', next: NextFunction): Promise<DataSuccess<User>> {
    const auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + ''))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    var user: User = auth.data!
    var getUser: User

    if (userId == user.id || userId == 'me') {
      userId = user.id!
    } else if (!user.admin) {
      next(new UnauthorizedException())
      throw null
    }

    try {
      getUser = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', +userId))[0]
    } catch (error) {
      next(new DBException())
      throw null
    }

    if (!getUser) {
      next(new RequestException('User does not exist'))
      throw null
    }

    delete getUser.password

    if (!user.admin) {
      delete getUser.status
    }

    return new DataSuccess(200, SUCCESS, 'Success', getUser)
  }

  async putUser(
    headers: IncomingHttpHeaders,
    body: any,
    userId: number | 'me',
    next: NextFunction
  ): Promise<DataSuccess<{ jwt?: string; user: User }>> {
    const auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + ''))

    if (!userId) {
      next(new RequestException('Missing parameters'))
      throw null
    }

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    var user: User = auth.data!
    var getUser: User
    const token = (headers['authorization'] + '').split(' ')[1]

    if (userId == user.id || userId == 'me') {
      userId = user.id!
    } else if (!user.admin) {
      next(new UnauthorizedException())
      throw null
    }

    try {
      getUser = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', +userId))[0]
    } catch (error) {
      next(new DBException())
      throw null
    }

    if (!getUser) {
      next(new RequestException('User does not exist'))
      throw null
    }

    let user_: User = {
      id: userId,
      name: body.name || getUser.name,
      password: getUser.password,
      admin: getUser.admin,
      status: user.admin && body.status ? +body.status : getUser.status,
      p_files_updater_add_del:
        user.admin && body.p_files_updater_add_del ? +body.p_files_updater_add_del : getUser.p_files_updater_add_del,
      p_bootstrap_mod: user.admin && body.p_bootstrap_mod ? +body.p_bootstrap_mod : getUser.p_bootstrap_mod,
      p_maintenance_mod: user.admin && body.p_maintenance_mod ? +body.p_maintenance_mod : getUser.p_maintenance_mod,
      p_news_add: user.admin && body.p_news_add ? +body.p_news_add : getUser.p_news_add,
      p_news_mod_del: user.admin && body.p_news_mod_del ? +body.p_news_mod_del : getUser.p_news_mod_del,
      p_news_category_add_mod_del:
        user.admin && body.p_news_category_add_mod_del ? +body.p_news_category_add_mod_del : getUser.p_news_category_add_mod_del,
      p_news_tag_add_mod_del:
        user.admin && body.p_news_tag_add_mod_del ? +body.p_news_tag_add_mod_del : getUser.p_news_tag_add_mod_del,
      p_background_mod: user.admin && body.p_background_mod ? +body.p_background_mod : getUser.p_background_mod,
      p_stats_see: user.admin && body.p_stats_see ? +body.p_stats_see : getUser.p_stats_see,
      p_stats_del: user.admin && body.p_stats_del ? +body.p_stats_del : getUser.p_stats_del,
    }

    if (getUser.admin) {
      user_.admin = 1
      user_.status = 1
      user_.p_files_updater_add_del = 1
      user_.p_bootstrap_mod = 1
      user_.p_maintenance_mod = 1
      user_.p_news_add = 1
      user_.p_news_mod_del = 1
      user_.p_news_category_add_mod_del = 1
      user_.p_news_tag_add_mod_del = 1
      user_.p_background_mod = 1
      user_.p_stats_see = 1
      user_.p_stats_del = 1
    }

    if (userId == user.id && body.password != null && body.password != '') {
      user_.password = await bcrypt.hash(body.password, 10)
    }

    if (body.name != getUser.name && body.name != '' && body.name != null) {
      var isNameAvailable = (await new AuthService().isNameAvailable(body.name)).code
    } else {
      var isNameAvailable: Code = SUCCESS
    }

    if (isNameAvailable == CLIENT_ERROR) {
      next(new UnauthorizedException('Name used'))
      throw null
    } else if (isNameAvailable == DB_ERROR) {
      next(new DBException())
      throw null
    }

    let updateUser: DataServiceResponse<{ id: number }>

    updateUser = await new AuthService().updateUser(user_)

    delete user_.password
    if (!user.admin) {
      delete user_.status
    }

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: userId == user.id ? token : undefined, user: user_ })
  }

  async deleteUser(headers: IncomingHttpHeaders, userId: number | 'me', next: NextFunction): Promise<DefaultSuccess> {
    const auth = nexter.serviceToException(await new AuthService().checkAuth(headers['authorization'] + ''))

    if (!auth.status) {
      next(auth.exception)
      throw null
    }

    var user: User = auth.data!
    var getUser: User

    if (userId == user.id || userId == 'me') {
      userId = user.id!
    } else if (!user.admin) {
      next(new UnauthorizedException())
      throw null
    }

    try {
      getUser = (await db.query<User[]>('SELECT * FROM users WHERE id = ?', +userId))[0]
    } catch (error) {
      next(new DBException())
      throw null
    }

    if (!getUser) {
      next(new RequestException('User does not exist'))
      throw null
    }

    if (getUser.admin) {
      next(new RequestException('Not allowed to delete admin'))
      throw null
    }

    try {
      await db.query('DELETE FROM users WHERE id = ?', +userId)
    } catch (error) {
      next(new DBException())
      throw null
    }

    return new DefaultSuccess(200, SUCCESS, 'Success')
  }
}

export default Admin
