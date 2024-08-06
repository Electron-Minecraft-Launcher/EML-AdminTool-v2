import { DefaultServiceResponse } from './default-service-response'

export interface DataServiceResponse<T> extends DefaultServiceResponse {
  data?: T
}
