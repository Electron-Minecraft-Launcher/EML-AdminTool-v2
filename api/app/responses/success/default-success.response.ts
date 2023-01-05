import { SUCCESS, SuccessCode } from "../../models/types"

export class DefaultSuccess {
  httpStatus: number
  code: SuccessCode
  message: string

  constructor(httpStatus: number = 200, code: SuccessCode = SUCCESS, message: string = 'Success') {
    this.httpStatus = httpStatus
    this.code = code
    this.message = message
  }
}
