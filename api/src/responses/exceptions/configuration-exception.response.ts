import { ResponseType } from "../../../../shared/types/types";
import { DefaultException } from "./default-exception.response";

export class ConfigurationException extends DefaultException {
  constructor(message: string = 'Needs configuration') {
    super(403, ResponseType.CONFIG_ERROR, message)
  }
}