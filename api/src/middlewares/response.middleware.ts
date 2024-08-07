import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import { DefaultResponse } from '../responses/response'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const send = res.send
  res.send = function (body: DefaultResponse) {
    if (typeof body === 'object') {
      if (body.code === 'SUCCESS') {
        console.log(
          `LOG  ${moment().format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${!req.path.startsWith('/api') ? '/api' + req.path : req.path}`
        )
      } else {
        console.error(
          `ERR  ${moment().format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${!req.path.startsWith('/api') ? '/api' + req.path : req.path} with code ${res.statusCode} and message '${body.message}'`
        )
      }
    }
    return send.call(res, body)
  }
  next()
}

export default middleware
