import { UNKNOWN_ERROR } from "../../models/types";
import { DefaultException } from "./default-exception.response";

export class UnknownException extends DefaultException {
  constructor(message: string = 'Unknown error') {
    super(500, UNKNOWN_ERROR, message)
  }
}
