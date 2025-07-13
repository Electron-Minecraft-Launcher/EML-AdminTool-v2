import { NotificationCode } from './notifications'

export class ServerError extends Error {
  public readonly details: unknown
  public readonly code: NotificationCode
  public readonly httpStatus: number

  constructor(message: string, details: unknown, code: NotificationCode = NotificationCode.INTERNAL_SERVER_ERROR, httpStatus: number = 500) {
    super(message)
    this.name = 'ServerError'
    this.details = details
    this.code = code
    this.httpStatus = httpStatus
  }
}

export class BusinessError extends Error {
  public readonly code: NotificationCode
  public readonly httpStatus: number

  constructor(message: string, code: NotificationCode = NotificationCode.INVALID_REQUEST, httpStatus: number = 400) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.httpStatus = httpStatus
  }
}
