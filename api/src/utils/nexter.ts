import { DataServiceResponse } from '$models/responses/services/data-service-response.model'
import { CLIENT_ERROR, AUTH_ERROR, CONFIG_ERROR, UNKNOWN_ERROR, DB_ERROR, SERVER_ERROR, SUCCESS } from '$models/types'
import { ConfigurationException } from '$responses/exceptions/configuration-exception.response'
import { DBException } from '$responses/exceptions/db-exception.response'
import { DefaultException } from '$responses/exceptions/default-exception.response'
import { RequestException } from '$responses/exceptions/request-exception.response'
import { ServerException } from '$responses/exceptions/server-exception.response'
import { UnauthorizedException } from '$responses/exceptions/unauthorized-exception.response'

class Nexter {
  /**
   * @return `!serviceToException.status ? ERROR : SUCCESS`
   */
  serviceToException<T>(service: DataServiceResponse<T>): T {
    if (service.status || service.code == SUCCESS) return service.data as T

    switch (service.code) {
      case CLIENT_ERROR:
        throw new RequestException(service.message || 'Bad Request')
      case AUTH_ERROR:
        throw new UnauthorizedException(service.message || 'Unauthorized')
      case CONFIG_ERROR:
        throw new ConfigurationException(service.message || 'Needs configuration')
      case SERVER_ERROR:
        throw new ServerException(service.message || 'Internal Server error')
      case DB_ERROR:
        throw new DBException(service.message || 'Unknown Database error')
      case UNKNOWN_ERROR:
        throw new DefaultException(500, UNKNOWN_ERROR, 'Unknown error')
      default:
        throw new ServerException(service.message || 'Internal Server error')
    }
  }
}

export default new Nexter()
