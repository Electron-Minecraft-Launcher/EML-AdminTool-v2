import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { DefaultServiceResponse } from '../../../shared/models/responses/services/default-service-response.model'
import { ResponseType } from '../../../shared/models/types'
import { Config } from '../../../shared/models/configurations/config.model'
import { User } from '../../../shared/models/features/user.model'
import db from '../utils/db'

class EnvService {
  setEnv(dbPassword?: string): DefaultServiceResponse {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+-=[]{};:<>,.?/'
    let jwtSecretKey = ''
    for (let i = 0; i < 128; i++) {
      jwtSecretKey += characters[Math.floor(Math.random() * characters.length)]
    }

    if (!dbPassword) dbPassword = 'eml'

    try {
      fs.writeFileSync(
        path.join(process.cwd(), '/.env'),
        `# # # # # # # # # # # # # # # # # # # # # # # # # # # #
#          DO NOT MODIFY OR DELETE THIS FILE          #
#                                                     #
# This file contains important environment variables  #
# for your application, including the password for    #
# your database and a JWT key. Modifying or deleting  #
# this file could prevent your application from       #
# functioning properly and potentially compromise its #
# security.                                           #
#                                                     #
# If you need to change any of these values, please   #
# use the appropriate configuration options rather    #
# than modifying this file directly.                  #
# Consult the documentation for your application for  #
# more information on how to configure these values   #
# safely.                                             #
# # # # # # # # # # # # # # # # # # # # # # # # # # # #

DATABASE_PASSWORD="${dbPassword}"
JWT_SECRET_KEY="${jwtSecretKey + ''}"
`
      )
      process.env['DATABASE_PASSWORD'] = dbPassword
      process.env['JWT_SECRET_KEY'] = jwtSecretKey
      dotenv.config()
      return { status: true, code: ResponseType.SUCCESS }
    } catch (error: any) {
      return { status: false, code: ResponseType.SERVER_ERROR, message: error.code }
    }
  }

  async getEnv() {
    var config: Config[] = []
    var name: User[] = []
    var env: {
      language: string
      name: string
      theme: string
    } = {
      language: 'en',
      name: 'EML',
      theme: 'eml',
    }

    try {
      config = await db.query<Config[]>('SELECT * FROM config')
    } catch (error: any) {
      return env
    }
    try {
      name = await db.query<User[]>('SELECT name FROM users WHERE admin = 1')
    } catch (error: any) {
      return env
    }

    env.language = config.find((language) => language.data == 'language')?.value || 'en'
    env.name = name[0] && name[0].name ? name[0].name : 'EML'
    env.theme = config.find((theme) => theme.data == 'theme')?.value || 'eml'

    return env
  }
}

export default new EnvService()