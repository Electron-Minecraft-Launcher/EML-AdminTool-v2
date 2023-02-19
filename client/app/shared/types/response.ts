export interface DefaultResponse {
  message: string
}


export interface DataResponse<T> extends DefaultResponse {
  data?: T
}


export interface ModelResponse<T> extends DataResponse<T> {
  code: number
}
