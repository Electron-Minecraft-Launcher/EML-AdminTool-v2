import express from 'express'
import { Request, Response, NextFunction } from 'express';

const router = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ message: 'Not found' });
}

export default router