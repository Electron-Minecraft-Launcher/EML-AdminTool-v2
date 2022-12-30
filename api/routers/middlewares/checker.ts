import { DefaultResponse } from '../../types/response';
import { Request, Response, NextFunction } from 'express';
import { Checker } from '../../models/checker';

const router = async (req: Request, res: Response<DefaultResponse>, next: NextFunction) => {

  const body = req.body
  const path = req.path
  const headers = req.headers

  const resp = await new Checker().check(body, path, headers)

  if (resp == 'Allowed') {
    next()
  } else if (resp == 'Unauthorized') {
    res.status(401).send({ message: 'Unauthorized' })
  } else if (resp == 'Needs configuration') {
    res.status(409).send({ message: 'Needs to configure the EML AdminTool' })
  } else {
    res.status(400).send({ message: 'Unknown error' })
  }

}

export default router
