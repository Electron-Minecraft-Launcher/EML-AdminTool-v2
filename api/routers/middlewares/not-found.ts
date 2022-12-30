import { DefaultResponse } from 'api/types/response';
import { Request, Response, NextFunction } from 'express';

const router = (req: Request, res: Response<DefaultResponse>, next: NextFunction) => {
  res.status(404).send({ message: 'Not found' });
}

export default router
