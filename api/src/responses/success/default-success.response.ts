import { ResponseType, SuccessCode } from '../../../../shared/types/types'
import { Request } from 'express'
import { DefaultResponse } from '../response'

export class DefaultSuccess extends DefaultResponse {
  constructor(req: Request, httpStatus: number = 200, code: SuccessCode = ResponseType.SUCCESS, message: string = 'Success') {
    super(httpStatus, code, message)
  }
}
