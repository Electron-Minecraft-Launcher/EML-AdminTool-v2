import { Code, ErrorCode } from '../../../../shared/types/types'
import { DefaultResponse } from '../response.response'

export class DefaultException extends DefaultResponse {
  constructor(httpStatus: number, code: ErrorCode, message: string) {
    super(httpStatus, code, message)
  }
}
