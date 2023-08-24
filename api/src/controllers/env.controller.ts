import { Config } from '$models/configurations/config.model'
import db from '$utils/database'
import { User } from '$models/features/user.model'
import { SUCCESS } from '$models/types'
import { DataSuccess } from '$responses/success/data-success.response'
import { NextFunction } from 'express'
import { EnvService } from '$services/env.service'

class Env {
  async env(): Promise<DataSuccess<any>> {
    const env = await new EnvService().getEnv()
    return new DataSuccess(200, SUCCESS, 'Success', env)
  }
}

export default Env
