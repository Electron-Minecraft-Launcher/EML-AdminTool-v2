import { NextFunction, Router, Request, Response } from 'express'
import { Route } from '../services/routes.model'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import Env from '../controllers/env.controller'
import { StatsRes } from '../../../shared/types/features/stats'
import { ControllerException } from '../responses/types'
import { DefaultHttpResponse } from '../../../shared/types/responses/http/default-http-response'
import Update from '../controllers/update.controller'

export default class UpdateRouter implements Route {
  path = '/update'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /update:
     *   get:
     *     tags:
     *       - Update
     *     summary: Get updates
     *     security:
     *      - bearer: []
     *     responses:
     *       200:
     *         description: Stats
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      `${this.path}`,
      async (req: Request, res: Response<DataHttpResponse<{ currentVersion: string; latestVersion: string }>>, next: NextFunction) => {
        try {
          const resp = await new Update().getUpdate(req, req.headers)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /update:
     *   post:
     *     tags:
     *      - Update
     *     summary: Update
     *     security:
     *      - bearer: []
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.post(`${this.path}`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Update().postUpdate(req, req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {
        next(error as ControllerException)
      }
    })
  }
}
