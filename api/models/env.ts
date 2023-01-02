import { ModelResponse } from "../types/response"
import { RowDataPacket } from "mysql2"
import { Config } from "../types/config"
import { query } from "../utils/database"
import { User } from "../types/user"

class Env {

  async env(): Promise<ModelResponse<object>> {

    var config: Config[]
    var name: User[]
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
      config = await query<Config[]>('SELECT * FROM config')
    } catch (error: any) {
      return {
        code: 400,
        message: error.code
      }
    }
    try {
      name = await query<User[]>('SELECT name FROM users WHERE admin = 1')
    } catch (error: any) {
      return {
        code: 400,
        message: error.code
      }
    }

    env.language = config.find(language => language.data == 'language')?.value || 'en'
    env.name = name[0] && name[0].name ? name[0].name : 'EML'
    env.theme = config.find(theme => theme.data == 'theme')?.value || 'eml'

    return {
      code: 200,
      message: 'Success',
      data: env
    }

  }

}

export default Env
