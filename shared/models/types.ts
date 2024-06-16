export type count = { count: number }

export enum ResponseType {
  /**
   * HTTP `2xx`
   */
  SUCCESS = 'SUCCESS',
  /**
   * HTTP `4xx`
   */
  CLIENT_ERROR = 'CLIENT_ERROR',
  /**
   * HTTP `401`
   */
  AUTH_ERROR = 'AUTH_ERROR',
  /**
   * HTTP `403`
   */
  CONFIG_ERROR = 'CONFIG_ERROR',
  /**
   * HTTP `404`
   */
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  /**
   * HTTP `5xx`
   */
  SERVER_ERROR = 'SERVER_ERROR',
  /**
   * HTTP `500`
   */
  DATABASE_ERROR = 'DATABASE_ERROR',
  /**
   * HTTP `500`
   */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export type SuccessCode = typeof ResponseType.SUCCESS
export type ErrorCode =
  | typeof ResponseType.CLIENT_ERROR
  | typeof ResponseType.AUTH_ERROR
  | typeof ResponseType.CONFIG_ERROR
  | typeof ResponseType.NOT_FOUND_ERROR
  | typeof ResponseType.SERVER_ERROR
  | typeof ResponseType.DATABASE_ERROR
  | typeof ResponseType.UNKNOWN_ERROR
export type Code = SuccessCode | ErrorCode
