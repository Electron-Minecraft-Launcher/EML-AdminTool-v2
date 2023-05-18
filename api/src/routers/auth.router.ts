import { NextFunction, Router } from 'express'
import { Route } from '$models/routes/route.model'
import { Request, Response } from 'express'
import { DefaultHttpResponse } from '$models/responses/http/default-http-response.model'
import { DataHttpResponse } from '$models/responses/http/data-http-response.model'
import Auth from '$controllers/auth.controller'
import { User } from '$models/features/user.model'

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
          const resp = await new Auth().auth(req.headers, next)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error) {}
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
          const resp = await new Auth().verify(req.headers, next)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error) {}
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
          const resp = await new Auth().register(req.body, next)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error) {}
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
        const resp = await new Auth().logout(req.headers, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {}
    })
  }
}
