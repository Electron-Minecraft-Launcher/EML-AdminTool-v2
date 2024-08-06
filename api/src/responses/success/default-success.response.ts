import moment from 'moment'
import { ResponseType, SuccessCode } from '../../../../shared/types/types'
import { Request } from 'express'

export class DefaultSuccess {
  httpStatus: number
  code: SuccessCode
  message: string

  constructor(req: Request, httpStatus: number = 200, code: SuccessCode = ResponseType.SUCCESS, message: string = 'Success') {
    this.httpStatus = httpStatus
    this.code = code
    this.message = message
  }
}
