import { SERVER_ERROR } from "../../models/types";
import { DefaultException } from "./default-exception.response";

export class ServerException extends DefaultException {
  constructor(message: string = 'Unknown server error') {
    super(500, SERVER_ERROR, message)
  }
}
