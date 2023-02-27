import { Config } from "../models/configurations/config.model"
import db from "../utils/database"
import { User } from "../models/features/user.model"
import { SUCCESS } from "../models/types"
import { DBException } from "../responses/exceptions/db-exception.response"
import { DataSuccess } from "../responses/success/data-success.response"
import { NextFunction } from "express"
import { ConfigurationException } from "../responses/exceptions/configuration-exception.response"

class Env {

  async env(next: NextFunction): Promise<DataSuccess<any>> {

    var config: Config[] = []
    var name: User[] = []
    var env: {
      language: string,
      name: string,
      theme: string
    } = {
      language: 'en',
      name: 'EML',
      theme: 'eml'
    }

    try {
      config = await db.query<Config[]>('SELECT * FROM config')
    } catch (error: any) {
      return new DataSuccess(200, SUCCESS, 'Success', {})
    }
    try {
      name = await db.query<User[]>('SELECT name FROM users WHERE admin = 1')
    } catch (error: any) {
      return new DataSuccess(200, SUCCESS, 'Success', {})
    }

    env.language = config.find(language => language.data == 'language')?.value || 'en'
    env.name = name[0] && name[0].name ? name[0].name : 'EML'
    env.theme = config.find(theme => theme.data == 'theme')?.value || 'eml'

    return new DataSuccess(200, SUCCESS, 'Success', env)

  }

}

export default Env
