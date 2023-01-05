import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DefaultSuccess } from '../responses/success/default-success.response';
import { DefaultServiceResponse } from '../models/responses/services/default-service-response.model';
import { SERVER_ERROR, SUCCESS } from '../models/types';

export function setEnv(dbPassword: string): DefaultServiceResponse {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+-=[]{};:<>,.?/';
  let jwtSecretKey = '';
  for (let i = 0; i < 128; i++) {
    jwtSecretKey += characters[Math.floor(Math.random() * characters.length)];
  }

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

DATABASE_PASSWORD="${dbPassword + ''}"
JWT_SECRET_KEY="${jwtSecretKey + ''}"
`)
    process.env['DATABASE_PASSWORD'] = dbPassword
    process.env['JWT_SECRET_KEY'] = jwtSecretKey
    dotenv.config()
    return { status: true, code: SUCCESS }
  } catch (error: any) {
    return { status: false, code: SERVER_ERROR, message: error.code }
  }

}
