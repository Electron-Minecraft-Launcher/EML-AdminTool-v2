import { CLIENT_ERROR } from '$models/types'
import { DefaultException } from './default-exception.response'

export class RequestException extends DefaultException {
  constructor(message: string = 'Bad request') {
    super(400, CLIENT_ERROR, message)
  }
}
