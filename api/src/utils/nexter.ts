import { DataServiceResponse } from "../../../shared/types/responses/services/data-service-response"
import { ResponseType } from "../../../shared/types/types"
import { ConfigurationException } from "../responses/exceptions/configuration-exception.response"
import { DBException } from "../responses/exceptions/db-exception.response"
import { DefaultException } from "../responses/exceptions/default-exception.response"
import { RequestException } from "../responses/exceptions/request-exception.response"
import { ServerException } from "../responses/exceptions/server-exception.response"
import { UnauthorizedException } from "../responses/exceptions/unauthorized-exception.response"


class Nexter {
  /**
   * @return `!serviceToException.status ? ERROR : SUCCESS`
   */
  serviceToException<T>(service: DataServiceResponse<T>): T {
    if (service.status || service.code == ResponseType.SUCCESS) return service.data as T

    switch (service.code) {
      case ResponseType.CLIENT_ERROR:
        throw new RequestException(service.message || 'Bad Request')
      case ResponseType.AUTH_ERROR:
        throw new UnauthorizedException(service.message || 'Unauthorized')
      case ResponseType.CONFIG_ERROR:
        throw new ConfigurationException(service.message || 'Needs configuration')
      case ResponseType.SERVER_ERROR:
        throw new ServerException(service.message || 'Internal Server error')
      case ResponseType.DATABASE_ERROR:
        throw new DBException(service.message || 'Unknown Database error')
      case ResponseType.UNKNOWN_ERROR:
        throw new DefaultException(500, ResponseType.UNKNOWN_ERROR, 'Unknown error')
      default:
        throw new ServerException(service.message || 'Internal Server error')
    }
  }
}

export default new Nexter()
