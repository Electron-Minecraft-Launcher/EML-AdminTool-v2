import { DataServiceResponse } from "../models/responses/services/data-service-response.model";
import { CLIENT_ERROR, AUTH_ERROR, CONFIG_ERROR, UNKNOWN_ERROR, DB_ERROR, SERVER_ERROR, SUCCESS } from "../models/types";
import { ConfigurationException } from "../responses/exceptions/configuration-exception.response";
import { DBException } from "../responses/exceptions/db-exception.response";
import { DefaultException } from "../responses/exceptions/default-exception.response";
import { RequestException } from "../responses/exceptions/request-exception.response";
import { ServerException } from "../responses/exceptions/server-exception.response";
import { UnauthorizedException } from "../responses/exceptions/unauthorized-exception.response";

class Nexter {

  /**
   *
   * @return `!serviceToException.status ? ERROR : SUCCESS`
   */
  serviceToException<T>(service: DataServiceResponse<T>): { status: boolean, exception?: any, data?: T } {

    if (service.status || service.code == SUCCESS)
      return { status: true, data: service.data }


    if (service.code == CLIENT_ERROR)
      return { status: false, exception: new RequestException(service.message || 'Bad Request') }

    if (service.code == AUTH_ERROR)
      return { status: false, exception: new UnauthorizedException(service.message || 'Unauthorized') }

    if (service.code == CONFIG_ERROR)
      return { status: false, exception: new ConfigurationException(service.message || 'Needs configuration') }

    if (service.code == SERVER_ERROR)
      return { status: false, exception: new ServerException(service.message || 'Internal Server error') }

    if (service.code == DB_ERROR)
      return { status: false, exception: new DBException(service.message || 'Unknown Database error') }

    if (service.code == UNKNOWN_ERROR)
      return { status: false, exception: new DefaultException(500, UNKNOWN_ERROR, 'Unknown error') }

    return { status: false, exception: new ServerException(service.message || 'Internal Server error') }

  }

}

export default new Nexter()
