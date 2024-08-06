import { ResponseType } from '../../../../shared/types/types'
import { DefaultException } from './default-exception.response'

export class TooManyRequestException extends DefaultException {
  constructor(message: string = 'Too many requests') {
    super(429, ResponseType.TOO_MANY_REQUESTS_ERROR, message)
  }
}
