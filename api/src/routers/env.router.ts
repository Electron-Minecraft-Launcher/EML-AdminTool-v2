import { NextFunction, Router, Request, Response } from 'express'
import { Route } from '../services/route.model'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import Env from '../controllers/env.controller'

export default class EnvRouter implements Route {
  path = '/env'
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
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<any>>, next: NextFunction) => {
      try {
        const resp = await new Env().env(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })
  }
}
