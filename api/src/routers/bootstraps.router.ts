import { NextFunction, Router, Request, Response } from 'express'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import { Route } from '../services/routes.model'
import { ControllerException } from '../responses/types'
import Bootstraps from '../controllers/bootstraps.controller'
import bootstrapsMiddleware from '../middlewares/bootstraps.middleware'
import { BootstrapsRes } from '../../../shared/types/features/bootstraps'

export default class BootstrapsRouter implements Route {
  path = '/bootstraps'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /bootstraps:
     *   get:
     *     tags:
     *       - Bootstraps
     *     summary: Get bootstraps
     *     responses:
     *       200:
     *         description: Files
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<BootstrapsRes>>, next: NextFunction) => {
      try {
        const resp = await new Bootstraps().getBootstraps(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /bootstraps:
     *   post:
     *     tags:
     *      - Bootstraps
     *     security:
     *      - bearer: []
     *     summary: Upload file and replace existing file
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               platform:
     *                 type: string
     *               version:
     *                 type: string
     *               file:
     *                 type: file
     *     responses:
     *       200:
     *         description: File uploaded
     *       401:
     *         description: Unauthorized
     */
    this.router.post(
      `${this.path}`,
      bootstrapsMiddleware,
      async (req: Request, res: Response<DataHttpResponse<BootstrapsRes>>, next: NextFunction) => {
        try {
          const resp = await new Bootstraps().uploadBootstrap(req, req.body)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /bootstraps:
     *   delete:
     *     tags:
     *      - Bootstraps
     *     security:
     *      - bearer: []
     *     summary: Delete file
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               platform:
     *                 type: string
     *     responses:
     *       200:
     *         description: File deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<BootstrapsRes>>, next: NextFunction) => {
      try {
        const resp = await new Bootstraps().deleteBootstrap(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })
  }
}
