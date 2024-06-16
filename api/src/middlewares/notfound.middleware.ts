import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import dateFormat from 'moment'
import { DefaultHttpResponse } from '../../../shared/models/responses/http/default-http-response.model'
import { ControllerException } from '../responses/types'

const middleware = (err: ControllerException, req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
  console.error(
    `ERR  ${dateFormat(moment()).format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${req.path} with code ${err.httpStatus} and message '${err.message}'`
  )
  res.status(err.httpStatus).send({ code: err.code, message: err.message })
}

export default middleware
