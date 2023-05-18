import { SUCCESS, SuccessCode } from '$models/types'
import { DefaultSuccess } from './default-success.response'

export class DataSuccess<T> extends DefaultSuccess {
  data: T

  constructor(httpStatus: number = 200, code: SuccessCode = SUCCESS, message: string = 'Success', data: T) {
    super(httpStatus, code, message)
    this.data = data
  }
}
