import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import dateFormat from 'moment'
import { DefaultHttpResponse } from '../../../shared/types/responses/http/default-http-response'
import { ControllerException } from '../responses/types'

const middleware = (err: ControllerException, req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/files')) {
    console.error(
      `ERR  ${dateFormat(moment()).format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${req.path} with code ${err.httpStatus} and message '${err.message}'`
    )
    res.status(err.httpStatus).send({ code: err.code, message: err.message })
  } else {
    next()
  }
}

export default middleware
