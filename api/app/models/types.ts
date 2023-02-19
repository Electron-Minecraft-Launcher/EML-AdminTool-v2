import { DefaultException } from "../responses/exceptions/default-exception.response"
import { UnauthorizedException } from "../responses/exceptions/unauthorized-exception.response"
import { ServerException } from "../responses/exceptions/server-exception.response"
import { DBException } from "../responses/exceptions/db-exception.response"
import { UnknownException } from "../responses/exceptions/unknown-exception.response"
import { DefaultSuccess } from "../responses/success/default-success.response"
import { DataSuccess } from "../responses/success/data-success.response"

export type varchar = string

export type tinyint = number

export type count = { count: number }

/**
 * HTTP `2xx`
 */
export const SUCCESS: 'SUCCESS' = 'SUCCESS'

/**
 * HTTP `4xx`
 */
export const CLIENT_ERROR: 'CLIENT_ERROR' = 'CLIENT_ERROR'
/**
 * HTTP `401`
 */
export const AUTH_ERROR: 'AUTH_ERROR' = 'AUTH_ERROR'
/**
 * HTTP `403`
 */
export const CONFIG_ERROR: 'CONFIG_ERROR' = 'CONFIG_ERROR'

/**
 * HTTP `500`
 */
export const SERVER_ERROR: 'SERVER_ERROR' = 'SERVER_ERROR'
/**
 * HTTP `500`
 */
export const DB_ERROR: 'DB_ERROR' = 'DB_ERROR'
/**
 * HTTP `500`
 */
export const UNKNOWN_ERROR: 'UNKNOWN_ERROR' = 'UNKNOWN_ERROR'

export type SuccessCode = typeof SUCCESS
export type ErrorCode = typeof CLIENT_ERROR | typeof AUTH_ERROR | typeof CONFIG_ERROR | typeof SERVER_ERROR | typeof DB_ERROR | typeof UNKNOWN_ERROR
export type Code = SuccessCode | ErrorCode

export type ControllerException = DefaultException | UnauthorizedException | ServerException | DBException | UnknownException
export type ControllerSuccess<T> = DefaultSuccess | DataSuccess<T>
export type ControllerResponse<T> = ControllerException | ControllerSuccess<T>

export type ServiceException = ControllerException
export type ServiceSuccess<T> = ControllerSuccess<T>
export type ServiceResponse<T> = ControllerResponse<T>
