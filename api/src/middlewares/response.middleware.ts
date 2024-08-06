import { RequestHandler } from 'express'
import moment from 'moment'

const middleware: RequestHandler = async (req, res, next) => {
  const send = res.send
  res.send = function (body: any) {
    console.log(`LOG  ${moment().format('YYYY-MM-DD HH:mm:ss')}  ${req.ip} ${req.method} ${req.path}`)
    return send.call(this, body)
  }
  next()
}

export default middleware