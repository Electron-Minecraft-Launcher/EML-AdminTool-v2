import { ResponseType } from '../../../../shared/types/types'
import { DefaultException } from './default-exception.response'

export class ServerException extends DefaultException {
  constructor(message: string = 'Internal Server error') {
    super(500, ResponseType.SERVER_ERROR, message)
  }
}
