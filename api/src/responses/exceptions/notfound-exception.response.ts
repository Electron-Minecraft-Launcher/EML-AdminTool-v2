import { ResponseType } from '../../../../shared/types/types'
import { DefaultException } from './default-exception.response'

export class NotFoundException extends DefaultException {
  constructor(message: string = 'Not found') {
    super(404, ResponseType.NOT_FOUND_ERROR, message)
  }
}
