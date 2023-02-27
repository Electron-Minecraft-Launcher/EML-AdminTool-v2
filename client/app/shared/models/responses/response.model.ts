export interface DefaultResponse {
  code: string
  message: string
}


export interface DataResponse<T> extends DefaultResponse {
  data?: T
}
