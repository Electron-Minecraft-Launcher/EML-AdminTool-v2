import { NextFunction, Router } from 'express'
import { Route } from '$models/routes/route.model'
import { Request, Response } from 'express'
import { DataHttpResponse } from '$models/responses/http/data-http-response.model'
import { User } from '$models/features/user.model'
import Admin from '$controllers/admin.controller'
import { DefaultHttpResponse } from '$models/responses/http/default-http-response.model'
import { EMLAdminToolInfo } from '$models/features/emlat-info.model'
import { ControllerException } from '$models/types'

export default class AdminRouter implements Route {
  path = '/api'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /admintool:
     *   get:
     *     tags:
     *       - Admin
     *     security:
     *       - bearer: []
     *     summary: Get EML AdminTool info
     *     responses:
     *       200:
     *         description: EML AdminTool info
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      `${this.path}/admintool`,
      async (req: Request, res: Response<DataHttpResponse<EMLAdminToolInfo>>, next: NextFunction) => {
        try {
          const resp = await new Admin().getAdminToolInfo(req.headers)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /admintool:
     *   put:
     *     tags:
     *       - Admin
     *     security:
     *       - bearer: []
     *     summary: Update EML AdminTool info
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               language:
     *                 type: string
     *               pin:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: EML AdminTool info updated
     *       401:
     *         description: Unauthorized
     */
    this.router.put(
      `${this.path}/admintool`,
      async (req: Request, res: Response<DataHttpResponse<EMLAdminToolInfo>>, next: NextFunction) => {
        try {
          const resp = await new Admin().putAdminToolInfo(req.headers, req.body)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /users:
     *   get:
     *     tags:
     *       - Admin
     *     security:
     *       - bearer: []
     *     summary: Get users list
     *     responses:
     *       200:
     *         description: Users list
     *       401:
     *         description: Unauthorized
     */
    this.router.get(`${this.path}/users`, async (req: Request, res: Response<DataHttpResponse<User[]>>, next: NextFunction) => {
      try {
        const resp = await new Admin().getUsers(req.headers)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /users/{user_id}:
     *   get:
     *     tags:
     *       - Admin
     *     security:
     *       - bearer: []
     *     summary: Get info about an user
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *     responses:
     *       200:
     *         description: Information
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      `${this.path}/users/:user_id`,
      async (req: Request<{ user_id: number | 'me' }, {}, {}, {}>, res: Response<DataHttpResponse<User>>, next: NextFunction) => {
        try {
          const resp = await new Admin().getUser(req.headers, req.params['user_id'])
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /users/{user_id}:
     *   put:
     *     tags:
     *       - Admin
     *     security:
     *       - bearer: []
     *     summary: Edit  an user
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               password:
     *                 type: string
     *               status:
     *                 type: integer
     *               p_files_updater_add_del:
     *                 type: integer
     *               p_bootstrap_mod:
     *                 type: integer
     *               p_maintenance_mod:
     *                 type: integer
     *               p_news_add:
     *                 type: integer
     *               p_news_mod_del:
     *                 type: integer
     *               p_news_category_add_mod_del:
     *                 type: integer
     *               p_news_tag_add_mod_del:
     *                 type: integer
     *               p_background_mod:
     *                 type: integer
     *               p_stats_see:
     *                 type: integer
     *               p_stats_del:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Information updated
     *       401:
     *         description: Unauthorized
     */
    this.router.put(
      `${this.path}/users/:user_id`,
      async (
        req: Request<{ user_id: number | 'me' }, {}, {}, {}>,
        res: Response<DataHttpResponse<{ jwt?: string; user: User }>>,
        next: NextFunction
      ) => {
        try {
          const resp = await new Admin().putUser(req.headers, req.body, req.params['user_id'])
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /users/{user_id}:
     *   delete:
     *     tags:
     *       - Admin
     *     security:
     *       - bearer: []
     *     summary: Delete an user
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: User deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(
      `${this.path}/users/:user_id`,
      async (req: Request<{ user_id: number | 'me' }, {}, {}, {}>, res: Response<DefaultHttpResponse>, next: NextFunction) => {
        try {
          const resp = await new Admin().deleteUser(req.headers, req.params['user_id'])
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )
  }
}
