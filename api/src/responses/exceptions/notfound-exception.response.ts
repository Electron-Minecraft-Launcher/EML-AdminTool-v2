import { ResponseType } from '../../../../shared/models/types'
import { DefaultException } from './default-exception.response'

export class NotFoundException extends DefaultException {
  constructor(message: string = 'Not found') {
    super(401, ResponseType.NOT_FOUND_ERROR, message)
  }
}
