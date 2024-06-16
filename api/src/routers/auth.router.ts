import { NextFunction, Router, Request, Response } from 'express'
import { User } from '../../../shared/models/features/user.model'
import { DataHttpResponse } from '../../../shared/models/responses/http/data-http-response.model'
import { DefaultHttpResponse } from '../../../shared/models/responses/http/default-http-response.model'
import { Route } from '../../../shared/models/routes/routes.model'
import Auth from '../controllers/auth.controller'
import { ControllerException } from '../responses/types'

export default class AuthRouter implements Route {
  path = '/api'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /auth:
     *   get:
     *     tags:
     *       - Auth
     *     security:
     *       - basic: []
     *     summary: Auth an user
     *     responses:
     *       200:
     *         description: Logged
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      `${this.path}/auth`,
      async (req: Request, res: Response<DataHttpResponse<{ jwt: string }>>, next: NextFunction) => {
        try {
          const resp = await new Auth().auth(req, req.headers)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /verify:
     *   get:
     *     tags:
     *       - Auth
     *     security:
     *       - bearer: []
     *     summary: Verify JWT
     *     responses:
     *       200:
     *         description: Password set
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      `${this.path}/verify`,
      async (req: Request, res: Response<DataHttpResponse<{ jwt: string; user: User }>>, next: NextFunction) => {
        try {
          const resp = await new Auth().verify(req, req.headers)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /register:
     *   post:
     *     tags:
     *      - Auth
     *     summary: Register to the EML AdminTool
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               password:
     *                 type: string
     *               pin:
     *                 type: string
     *     responses:
     *       200:
     *         description: User registered
     *       401:
     *         description: Unauthorized
     */
    this.router.post(
      `${this.path}/register`,
      async (req: Request, res: Response<DataHttpResponse<{ jwt: string; user: User }>>, next: NextFunction) => {
        try {
          const resp = await new Auth().register(req, req.body)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /logout:
     *   delete:
     *     tags:
     *      - Auth
     *     security:
     *       - bearer: []
     *     summary: Logout the user
     *     responses:
     *       200:
     *         description: Logged out
     */
    this.router.delete(`${this.path}/logout`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Auth().logout(req, req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })
  }
}
