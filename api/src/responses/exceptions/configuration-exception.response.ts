import { CONFIG_ERROR } from '$models/types'
import { DefaultException } from './default-exception.response'

export class ConfigurationException extends DefaultException {
  constructor(message: string = 'Needs configuration') {
    super(403, CONFIG_ERROR, message)
  }
}
