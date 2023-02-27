import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import dateFormat from 'moment'
import { DefaultHttpResponse } from '../models/responses/http/default-http-response.model';

const middleware = (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
  console.log(`LOG  ${dateFormat(moment()).format('YYYY-MM-DD HH:mm:SS')}  ${req.ip} ${req.method} ${req.path}`)
  next()
}

export default middleware
