import { DefaultHttpResponse } from './default-http-response.model'

export interface DataHttpResponse<T> extends DefaultHttpResponse {
  data?: T
}
