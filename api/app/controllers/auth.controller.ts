import { Config } from "../models/configurations/config.model"
import db from "../utils/database"
import { Auth as Auth_ } from '../services/auth.service'
import pin_ from '../utils/pin'
import bcrypt from 'bcrypt';
import { User } from "../models/features/user.model"
import { CLIENT_ERROR, DB_ERROR, SUCCESS, UNKNOWN_ERROR } from "../models/types"
import { DBException } from "../responses/exceptions/db-exception.response"
import { DataSuccess } from "../responses/success/data-success.response"
import { NextFunction } from "express"
import { IncomingHttpHeaders } from "http"
import { DefaultSuccess } from "../responses/success/default-success.response"
import { RequestException } from "../responses/exceptions/request-exception.response";
import { UnauthorizedException } from "../responses/exceptions/unauthorized-exception.response";
import { ResultSetHeader } from "mysql2";
import { DataServiceResponse } from "../models/responses/services/data-service-response.model";
import jwt from "../utils/jwt";
import { DefaultException } from "../responses/exceptions/default-exception.response";

class Auth {

  async auth(headers: IncomingHttpHeaders, next: NextFunction): Promise<DataSuccess<{ jwt: string, user: User }>> {

    const auth = headers['authorization']

    if (!auth || !auth.startsWith('Basic ')) {
      next(new UnauthorizedException())
      throw null
    }
    const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii')
    const [name, password] = credentials.split(':')
    var user: User[] | null

    try {
      user = await db.query<User[]>('SELECT * FROM users WHERE name = ?', [name])
    } catch (error: any) {
      next(new DBException())
      throw null
    }

    if (!user[0] || !user[0].name || !(await bcrypt.compare(password, user[0].password + ''))) {
      next(new UnauthorizedException())
      throw null
    }

    delete user[0].password
    delete user[0].status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: jwt.generate(user[0]), user: user[0] })

  }

  async verify(headers: IncomingHttpHeaders, next: NextFunction): Promise<DataSuccess<{ jwt: string, user: User }>> {

    const auth = headers['authorization']

    if (!auth || !auth.startsWith('Bearer ')) {
      next(new UnauthorizedException())
      throw null
    }

    const token = auth.split(' ')[1]

    const dec = await jwt.verify(token)

    if (!dec[0] && dec[1] == 401) {
      next(new UnauthorizedException(dec[2]))
      throw null
    } else if (!dec[0] && dec[1] == 500) {
      next(new DBException())
      throw null
    } else if (!dec[0]) {
      next(new DefaultException(500, UNKNOWN_ERROR, 'Unknown error'))
      throw null
    }

    var user: User[] | null

    if (!jwt.isJwtPayload(dec[1])) {
      next(new UnauthorizedException())
      throw null
    }

    try {
      user = await db.query<User[]>('SELECT * FROM users WHERE id = ?', [dec[1].sub])
    } catch (error: any) {
      next(new DBException())
      throw null
    }

    if (!user[0] || !user[0].name) {
      next(new UnauthorizedException())
      throw null
    }

    delete user[0].password
    delete user[0].status

    return new DataSuccess(200, SUCCESS, 'Success', { jwt: token, user: user[0] })

  }

  async register(body: any, next: NextFunction): Promise<DataSuccess<{ jwt: string, user: User }>> {

    if (!body.name || body.name == '' || !body.password || body.password == '' || !body.pin) {
      next(new RequestException('Missing parameters'))
      throw null
    }

    const name = body.name
    const password = { clear: body.password, hash: await bcrypt.hash(body.password, 10) }
    const pin = body.pin

    const user: User = { name: name, password: password.hash, status: 0, admin: 0, p_files_updater_add_del: 0, p_bootstrap_mod: 0, p_maintenance_mod: 0, p_news_add: 0, p_news_mod_del: 0, p_news_category_add_mod_del: 0, p_news_tag_add_mod_del: 0, p_background_mod: 0, p_stats_del: 0 }

    var isNameAvailable = (await new Auth_().isNameAvailable(name)).code

    if (isNameAvailable == CLIENT_ERROR) {
      next(new UnauthorizedException('Name used'))
      throw null
    } else if (isNameAvailable == DB_ERROR) {
      next(new DBException())
      throw null
    }

    let addUser: DataServiceResponse<{ id: number }>

    if (pin != await pin_.get()) {
      user.status = -1
      addUser = (await new Auth_().insertUser(user))
      if (addUser.code == DB_ERROR) {
        next(new DBException())
        throw null
      }
    } else {
      addUser = (await new Auth_().insertUser(user))
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

    const auth = headers['authorization']

    if (!auth || !auth.startsWith('Bearer ')) {
      next(new UnauthorizedException())
      throw null
    }

    const token = auth.split(' ')[1]

    const dec = await jwt.verify(token)

    if (!dec[0] && dec[1] == 401) {
      next(new UnauthorizedException(dec[2]))
      throw null
    } else if (!dec[0] && dec[1] == 500) {
      next(new DBException())
      throw null
    } else if (!dec[0]) {
      next(new DefaultException(500, UNKNOWN_ERROR, 'Unknown error'))
      throw null
    }

    var user: User[] | null

    if (!jwt.isJwtPayload(dec[1])) {
      next(new UnauthorizedException())
      throw null
    }

    try {
      user = await db.query<User[]>('INSERT INTO exp_jwt (jwt) VALUES (?)', [token])
    } catch (error: any) {
      next(new DBException())
      throw null
    }

    return new DefaultSuccess()

  }

}

export default Auth
