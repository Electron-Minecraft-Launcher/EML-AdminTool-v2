import { ResponseType } from '../../../../shared/types/types'
import { DefaultException } from './default-exception.response'

export class UnauthorizedException extends DefaultException {
  constructor(message: string = 'Unauthorized') {
    super(401, ResponseType.AUTH_ERROR, message)
  }
}
