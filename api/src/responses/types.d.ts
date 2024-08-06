import { DBException } from './exceptions/db-exception.response'
import { DefaultException } from './exceptions/default-exception.response'
import { RequestException } from './exceptions/request-exception.response'
import { ServerException } from './exceptions/server-exception.response'
import { UnauthorizedException } from './exceptions/unauthorized-exception.response'
import { DataSuccess } from './success/data-success.response'
import { DefaultSuccess } from './success/default-success.response'

export type ControllerException = DefaultException | UnauthorizedException | ServerException | DBException | RequestException
export type ControllerSuccess<T> = DefaultSuccess | DataSuccess<T>
export type ControllerResponse<T> = ControllerException | ControllerSuccess<T>

export type ServiceException = ControllerException
export type ServiceSuccess<T> = ControllerSuccess<T>
export type ServiceResponse<T> = ControllerResponse<T>