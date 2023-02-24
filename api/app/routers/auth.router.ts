import { NextFunction, Router } from "express";
import { Route } from "../models/routes/route.model";
import { Request, Response } from 'express'
import { DefaultHttpResponse } from "../models/responses/http/default-http-response.model";
import { DataHttpResponse } from "../models/responses/http/data-http-response.model";
import Auth from "../controllers/auth.controller";

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
    this.router.get(`${this.path}/auth`, async (req: Request, res: Response<DataHttpResponse<{ jwt: string }>>, next: NextFunction) => {
      try {
        const resp = await new Auth().auth(req.headers, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error) {
      }
    })

    /**
     * @openapi
     * /verify:
     *   put:
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
    this.router.get(`${this.path}/verify`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        // const resp = await new Auth().verify(req.body, next)
        // res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {
      }
    })


    /**
     * @openapi
     * /register:
     *   put:
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
    this.router.put(`${this.path}/register`, async (req: Request, res: Response<DataHttpResponse<{ jwt: string }>>, next: NextFunction) => {
      try {
        const resp = await new Auth().register(req.body, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: { jwt: resp.data.jwt } })
      } catch (error) {
      }
    })

    /**
     * @openapi
     * /logout:
     *   put:
     *     tags:
     *      - Auth
     *     security:
     *       - bearer: []
     *     summary: Logout the user
     *     responses:
     *       200:
     *         description: Logged out
     */
    this.router.put(`${this.path}/admin`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      // try {
      //   const resp = await new Auth().logout(req.body, next)
      //   res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      // } catch (error) {
      // }
    })
  }

}
