import { NextFunction, Router } from "express";
import { Route } from "../models/routes/route.model";
import { Request, Response } from 'express'
import Env from "../controllers/env.controller";
import { DataHttpResponse } from "../models/responses/http/data-http-response.model";

export default class EnvRouter implements Route {
  path = '/api/env'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /env:
     *   get:
     *     tags:
     *       - Environnement
     *     summary: Get environnement
     *     responses:
     *       200:
     *         description: Environnement
     *       400:
     *         description: Unknown error
     */
    this.router.get('/api/env', async (req: Request, res: Response<DataHttpResponse<any>>, next: NextFunction) => {
      try {
        const resp = await new Env().env(next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error) {
      }
    })
  }

}
