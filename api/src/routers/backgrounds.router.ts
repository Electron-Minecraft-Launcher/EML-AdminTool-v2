import { NextFunction, Router, Request, Response } from 'express'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import { Route } from '../services/routes.model'
import { ControllerException } from '../responses/types'
import Backgrounds from '../controllers/backgrounds.controller'
import backgroundsMiddleware from '../middlewares/backgrounds.middleware'
import { BootstrapsRes } from '../../../shared/types/features/bootstraps'
import { BackgroundsRes } from '../../../shared/types/features/background'

export default class BackgroundsRouter implements Route {
  path = '/backgrounds'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /backgrounds:
     *   get:
     *     tags:
     *       - Backgrounds
     *     summary: Get backgrounds list
     *     responses:
     *       200:
     *         description: Backgrounds list
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<BackgroundsRes[]>>, next: NextFunction) => {
      try {
        const resp = await new Backgrounds().getBackgrounds(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /backgrounds/{background_id}:
     *   get:
     *     tags:
     *       - Backgrounds
     *     summary: Get background
     *     parameters:
     *       - in: path
     *         name: background_id
     *         required: true
     *     responses:
     *       200:
     *         description: Background
     */
    this.router.get(
      `${this.path}/:background_id`,
      async (req: Request<{ background_id: number }, any, any, any>, res: Response<DataHttpResponse<BackgroundsRes>>, next: NextFunction) => {
        try {
          const resp = await new Backgrounds().getBackground(req, req.params.background_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (err: any) {
          res.status(err.httpStatus).send({ code: err.code, message: err.message })
        }
      }
    )

    /**
     * @openapi
     * /backgrounds:
     *   post:
     *     tags:
     *       - Backgrounds
     *     security:
     *      - bearer: []
     *     summary: Upload background
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               status:
     *                 type: string
     *               file:
     *                 type: file
     *     responses:
     *       200:
     *         description: Background uploaded
     *       401:
     *         description: Unauthorized
     */
    this.router.post(
      `${this.path}`,
      backgroundsMiddleware,
      async (req: Request, res: Response<DataHttpResponse<BackgroundsRes[]>>, next: NextFunction) => {
        try {
          const resp = await new Backgrounds().uploadBackground(req, req.body)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (err: any) {
          res.status(err.httpStatus).send({ code: err.code, message: err.message })
        }
      }
    )

    /**
     * @openapi
     * /backgrounds:
     *   put:
     *     tags:
     *       - Backgrounds
     *     security:
     *      - bearer: []
     *     summary: Make background active
     *     requestBody:
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               background_id:
     *                 type: string
     *     responses:
     *       200:
     *         description: Background activated
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<BackgroundsRes[]>>, next: NextFunction) => {
      try {
        const resp = await new Backgrounds().putActiveBackground(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /backgrounds/{background_id}:
     *   put:
     *     tags:
     *       - Backgrounds
     *     security:
     *      - bearer: []
     *     summary: Change background title
     *     parameters:
     *       - in: path
     *         name: background_id
     *         required: true
     *     requestBody:
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *     responses:
     *       200:
     *         description: Background title changed
     *       401:
     *         description: Unauthorized
     */
    this.router.put(
      `${this.path}/:background_id`,
      async (req: Request<{ background_id: number }, any, any, any>, res: Response<DataHttpResponse<BackgroundsRes[]>>, next: NextFunction) => {
        try {
          const resp = await new Backgrounds().putBackgroundTitle(req, req.headers, req.body, req.params.background_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (err: any) {
          res.status(err.httpStatus).send({ code: err.code, message: err.message })
        }
      }
    )

    /**
     * @openapi
     * /backgrounds/{background_id}:
     *   delete:
     *     tags:
     *       - Backgrounds
     *     security:
     *      - bearer: []
     *     summary: Delete background
     *     parameters:
     *       - in: path
     *         name: background_id
     *         required: true
     *     responses:
     *       200:
     *         description: Background deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(
      `${this.path}/:background_id`,
      async (req: Request<{ background_id: number }, any, any, any>, res: Response<DataHttpResponse<BackgroundsRes[]>>, next: NextFunction) => {
        try {
          const resp = await new Backgrounds().deleteBackground(req, req.headers, req.params.background_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (err: any) {
          res.status(err.httpStatus).send({ code: err.code, message: err.message })
        }
      }
    )
  }
}
