import { ResponseType } from '../../../../shared/types/types'
import { DefaultException } from './default-exception.response'

export class DBException extends DefaultException {
  constructor(message: string = 'Unknown Database error') {
    super(500, ResponseType.DATABASE_ERROR, message)
    console.error(message)
  }
}
