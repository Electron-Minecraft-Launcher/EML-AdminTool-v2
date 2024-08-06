import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import dateFormat from 'moment'
import { DefaultHttpResponse } from '../../../shared/types/responses/http/default-http-response'
import { ResponseType } from '../../../shared/types/types'

const middleware = (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/files')) {
    console.error(
      `ERR  ${dateFormat(moment()).format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${req.path} with code 404 and message 'Not found'`
    )
    res.status(404).send({ code: ResponseType.NOT_FOUND_ERROR, message: 'Not found' })
  } else {
    next()
  }
}

export default middleware
