import { Request, Response, NextFunction } from 'express';
import { CheckerService } from '../services/checker.service';
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response';
import { DefaultHttpResponse } from '../models/responses/http/default-http-response.model';
import { AUTH_ERROR, CONFIG_ERROR, SUCCESS } from '../models/types';
import { ConfigurationException } from '../responses/exceptions/configuration-exception.response';
import { DefaultSuccess } from '../responses/success/default-success.response'
import { ServerException } from '../responses/exceptions/server-exception.response';

const router = async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {

  const body = req.body
  const path = req.path
  const headers = req.headers

  const resp = await new CheckerService().check(body, path, headers)

  if (resp.code == SUCCESS) {
    next()
  } else if (resp.code == AUTH_ERROR) {
    next(new UnauthorizedException())
  } else if (resp.code == CONFIG_ERROR) {
    if (resp.status) {
      next(new DefaultSuccess(200, CONFIG_ERROR, 'Needs configuration'))
    } else {
      next(new ConfigurationException())
    }
  } else {
    next(new ServerException())
  }

}

export default router
