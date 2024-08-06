import { RequestHandler } from 'express'
import checkerService from '../services/checker.service'
import { ResponseType } from '../../../shared/types/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { ConfigurationException } from '../responses/exceptions/configuration-exception.response'
import { ServerException } from '../responses/exceptions/server-exception.response'

const middleware: RequestHandler = async (req, res, next) => {
  const { body, path, headers } = req

  const resp = await checkerService.check(body, path, headers)

  if (resp.code === ResponseType.SUCCESS) next()
  else if (resp.code === ResponseType.AUTH_ERROR) next(new UnauthorizedException())
  else if (resp.code === ResponseType.CONFIG_ERROR) next(new ConfigurationException())
  else next(new ServerException())
}

export default middleware
