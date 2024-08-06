import { DefaultHttpResponse } from './default-http-response'

export interface DataHttpResponse<T> extends DefaultHttpResponse {
  data?: T
}
