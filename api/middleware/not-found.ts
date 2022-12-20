import { Request, Response, NextFunction } from "express";

module.exports = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ message: 'Not found' });
};