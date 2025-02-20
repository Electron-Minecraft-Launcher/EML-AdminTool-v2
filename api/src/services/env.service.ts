import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { DefaultServiceResponse } from '../../../shared/types/responses/services/default-service-response'
import { ResponseType } from '../../../shared/types/types'
import { Config } from '../../../shared/types/configurations/config'
import { User } from '../../../shared/types/features/user'
import db from '../utils/db'
import filesService from './files.service'
import pkg from '../../../package.json'
import crypto from 'crypto'

class EnvService {
  async setEnv(dbPassword?: string): Promise<DefaultServiceResponse> {
    let jwtSecretKey = crypto.randomBytes(32).toString('hex')

    if (!dbPassword) dbPassword = 'eml'

    const devMessage =
      process.env.NODE_ENV === 'development'
        ? `
# # # # # # # # # # # # # # # # # # # # # # # # # # # #
#       FAKE ENVIRONMENT VARIABLES FOR TESTING        #
# # # # # # # # # # # # # # # # # # # # # # # # # # # #
`
        : ''

    try {
      fs.writeFileSync(
        path.join(filesService.cwd(), 'api', 'env', '.env'),
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
${devMessage}
DATABASE_PASSWORD="${dbPassword}"
JWT_SECRET_KEY="${jwtSecretKey + ''}"
`
      )
      process.env['DATABASE_PASSWORD'] = dbPassword
      process.env['JWT_SECRET_KEY'] = jwtSecretKey
      dotenv.config({ path: path.join(filesService.cwd(), 'api', 'env', '.env') })
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
      version: string
    } = {
      language: 'en',
      name: 'EML',
      theme: 'eml',
      version: ''
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
    env.version = pkg.version

    return env
  }
}

export default new EnvService()

