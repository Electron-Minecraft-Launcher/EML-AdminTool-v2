import { AUTH_ERROR } from '$models/types'
import { DefaultException } from './default-exception.response'

export class UnauthorizedException extends DefaultException {
  constructor(message: string = 'Unauthorized') {
    super(401, AUTH_ERROR, message)
  }
}
