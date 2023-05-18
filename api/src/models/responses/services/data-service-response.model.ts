import { Code } from '../../types'
import { DefaultServiceResponse } from './default-service-response.model'

export interface DataServiceResponse<T> extends DefaultServiceResponse {
  data?: T
}
