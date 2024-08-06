import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import envService from '../services/env.service'
import { ResponseType } from '../../../shared/types/types'

class Env {
  async env(req: Request): Promise<DataSuccess<any>> {
    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', await envService.getEnv())
  }
}

export default Env
