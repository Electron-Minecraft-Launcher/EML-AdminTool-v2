import { NextFunction, Router, Request, Response } from 'express'
import { User } from '../../../shared/types/features/user'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import { DefaultHttpResponse } from '../../../shared/types/responses/http/default-http-response'
import { Route } from '../services/route.model'
import Auth from '../controllers/auth.controller'
import { ControllerException } from '../responses/types'

export default class AuthRouter implements Route {
  path = ''
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
    this.router.get(`${this.path}/auth`, async (req: Request, res: Response<DataHttpResponse<{ jwt: string }>>, next: NextFunction) => {
      try {
        const resp = await new Auth().auth(req, req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

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
    this.router.get(`${this.path}/verify`, async (req: Request, res: Response<DataHttpResponse<{ jwt: string; user: User }>>, next: NextFunction) => {
      try {
        const resp = await new Auth().verify(req, req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /register:
     *   post:
     *     tags:
     *      - Auth
     *     summary: Register to EML AdminTool
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
        } catch (err: any) {
          res.status(err.httpStatus).send({ code: err.code, message: err.message })
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
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })
  }
}
