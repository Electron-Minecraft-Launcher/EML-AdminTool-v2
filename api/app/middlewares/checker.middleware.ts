import { Request, Response, NextFunction } from 'express';
import { Checker } from '../services/checker.service';
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response';
import { DefaultHttpResponse } from '../models/responses/http/default-http-response.model';
import { UnknownException } from '../responses/exceptions/unknown-exception.response';
import { AUTH_ERROR, CONFIG_ERROR, SUCCESS } from '../models/types';
import { ConfigurationException } from '../responses/exceptions/configuration-exception.response';

const router = async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {

  const body = req.body
  const path = req.path
  const headers = req.headers

  const resp = await new Checker().check(body, path, headers)

  if (resp.code == SUCCESS) {
    next()
  } else if (resp.code == AUTH_ERROR) {
    next(new UnauthorizedException())
  } else if (resp.code == CONFIG_ERROR) {
    next(new ConfigurationException())
  } else {
    next(new UnknownException())
  }

}

export default router
