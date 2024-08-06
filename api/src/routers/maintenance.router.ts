import { NextFunction, Router, Request, Response } from 'express'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import { Route } from '../services/routes.model'
import { ControllerException } from '../responses/types'
import Bootstraps from '../controllers/bootstraps.controller'
import { Maintenance as Maintenance_ } from '../../../shared/types/features/maintenance'
import Maintenance from '../controllers/maintenance.controller'

export default class MaintenanceRouter implements Route {
  path = '/maintenance'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /maintenance:
     *   get:
     *     tags:
     *       - Maintenance
     *     summary: Get maintenance status
     *     responses:
     *       200:
     *         description: Files
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<Maintenance_>>, next: NextFunction) => {
      try {
        const resp = await new Maintenance().getMaintenanceStatus(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /maintenance:
     *   put:
     *     tags:
     *      - Maintenance
     *     security:
     *      - bearer: []
     *     summary: Change maintenance status
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               start_date:
     *                 type: string
     *               end_date:
     *                 type: string
     *               reason:
     *                 type: string
     *     responses:
     *       200:
     *         description: Maintenance status changed
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<Maintenance_>>, next: NextFunction) => {
      try {
        const resp = await new Maintenance().updateMaintenanceStatus(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })
  }
}
