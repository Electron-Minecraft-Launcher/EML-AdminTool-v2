import { NextFunction, Router, Request, Response } from 'express'
import { Route } from '../services/route.model'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import Env from '../controllers/env.controller'
import { StatsRes } from '../../../shared/types/features/stats'
import Stats from '../controllers/stats.controller'
import { ControllerException } from '../responses/types'
import { DefaultHttpResponse } from '../../../shared/types/responses/http/default-http-response'

export default class StatsRouter implements Route {
  path = '/stats'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /stats:
     *   get:
     *     tags:
     *       - Stats
     *     summary: Get stats
     *     security:
     *      - bearer: []
     *     responses:
     *       200:
     *         description: Stats
     *       401:
     *         description: Unauthorized
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<StatsRes>>, next: NextFunction) => {
      try {
        const resp = await new Stats().getStats(req, req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /stats:
     *   post:
     *     tags:
     *      - Stats
     *     summary: Post a stat
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               action:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.post(`${this.path}`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Stats().postStat(req, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /stats:
     *   delete:
     *     tags:
     *      - Stats
     *     summary: Delete all stats
     *     security:
     *      - bearer: []
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.delete(`${this.path}`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Stats().deleteStats(req, req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })
  }
}
