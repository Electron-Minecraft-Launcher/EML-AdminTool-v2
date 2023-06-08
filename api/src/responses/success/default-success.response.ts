import { SUCCESS, CONFIG_ERROR, SuccessCode } from '$models/types'

export class DefaultSuccess {
  httpStatus: number
  code: SuccessCode | typeof CONFIG_ERROR
  message: string

  constructor(httpStatus: number = 200, code: SuccessCode | typeof CONFIG_ERROR = SUCCESS, message: string = 'Success') {
    this.httpStatus = httpStatus
    this.code = code
    this.message = message
  }
}
