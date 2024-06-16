import { ResponseType } from '../../../../shared/models/types'
import { DefaultException } from './default-exception.response'

export class RequestException extends DefaultException {
  constructor(message: string = 'Bad request') {
    super(400, ResponseType.CLIENT_ERROR, message)
  }
}
