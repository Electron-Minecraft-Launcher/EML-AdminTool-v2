import { Code, ErrorCode } from "../../../../shared/types/types"

export class DefaultException {
  httpStatus: number
  code: Code
  message: string

  constructor(httpStatus: number, code: ErrorCode, message: string = '') {
    this.httpStatus = httpStatus
    this.code = code
    this.message = message
  }
}