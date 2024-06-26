import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import dateFormat from 'moment'
import { DefaultHttpResponse } from '../../../shared/models/responses/http/default-http-response.model'
import { ResponseType } from '../../../shared/models/types'

const middleware = (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
  console.error(
    `ERR  ${dateFormat(moment()).format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${req.path} with code 404 and message 'Not found'`
  )
  res.status(404).send({ code: ResponseType.NOT_FOUND_ERROR, message: 'Not found' })
}

export default middleware
