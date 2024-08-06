import { Request } from 'express'
import { ResponseType, SuccessCode } from '../../../../shared/types/types'
import { DefaultSuccess } from './default-success.response'

export class DataSuccess<T> extends DefaultSuccess {
  data: T

  constructor(req: Request, httpStatus: number = 200, code: SuccessCode = ResponseType.SUCCESS, message: string = 'Success', data: T) {
    super(req, httpStatus, code, message)
    this.data = data
  }
}
