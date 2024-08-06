import { Code, ResponseType } from '../../../shared/types/types'
import { Request } from 'express'

export class DefaultResponse {
  httpStatus: number
  code: Code
  message: string

  constructor(httpStatus: number, code: Code, message: string) {
    this.httpStatus = httpStatus
    this.code = code
    this.message = message
  }
}
