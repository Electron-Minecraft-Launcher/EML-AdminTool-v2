import { NextFunction, Router } from "express";
import { Route } from "../models/routes/route.model";
import { Request, Response } from 'express'
import Configure from '../controllers/configure.controller';
import { DefaultHttpResponse } from "../models/responses/http/default-http-response.model";

export default class ConfigureRouter implements Route {
  path = '/api/configure'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {

    /**
     * @openapi
     * /configure:
     *   get:
     *     tags:
     *       - Configuration
     *     summary: If needs to configure
     *     responses:
     *       200:
     *         description: Needs to configure
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Configure().check(req.body, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {
      }
    })

    /**
     * @openapi
     * /configure/language:
     *   put:
     *     tags:
     *       - Configuration
     *     security:
     *       - basic: []
     *       - bearer: []
     *     summary: Configure language
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               language:
     *                 type: string
     *     responses:
     *       200:
     *         description: Password set
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}/language`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Configure().language(req.body, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {
      }
    })


    /**
     * @openapi
     * /configure/database:
     *   put:
     *     tags:
     *      - Configuration
     *     security:
     *       - basic: []
     *       - bearer: []
     *     summary: Configure Database
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Password set
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}/database`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Configure().database(req.body, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {
      }
    })

    /**
     * @openapi
     * /configure/admin:
     *   put:
     *     tags:
     *      - Configuration
     *     security:
     *       - basic: []
     *       - bearer: []
     *     summary: Configure the admin account of the server
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
     *     responses:
     *       200:
     *         description: Password set
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}/admin`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
      try {
        const resp = await new Configure().admin(req.body, next)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
      } catch (error) {
      }
    })
  }

}