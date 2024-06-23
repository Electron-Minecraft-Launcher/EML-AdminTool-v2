import { NextFunction, Router, Request, Response } from 'express'
import { User } from '../../../shared/models/features/user.model'
import { DataHttpResponse } from '../../../shared/models/responses/http/data-http-response.model'
import { DefaultHttpResponse } from '../../../shared/models/responses/http/default-http-response.model'
import { Route } from '../services/routes.model'
import Auth from '../controllers/auth.controller'
import { ControllerException } from '../responses/types'
import FilesUpdater from '../controllers/filesupdater.controller'
import { File } from '../../../shared/models/features/filesupdater.model'
import filesService from '../services/files.service'

export default class FilesUpdaterRouter implements Route {
  path = '/api/files-updater'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /files-updater:
     *   get:
     *     tags:
     *       - Files Updater
     *     summary: Get modpack
     *     responses:
     *       200:
     *         description: Files
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().getFilesUpdater(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /files-updater:
     *   post:
     *     tags:
     *      - Files Updater
     *     security:
     *      - bearer: []
     *     summary: Upload files
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *               files:
     *                 type: file
     *     responses:
     *       200:
     *         description: Files uploaded
     *       401:
     *         description: Unauthorized
     */
    this.router.post(`${this.path}`, filesService.upload, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().uploadFilesUpdater(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    // /**
    //  * @openapi
    //  * /logout:
    //  *   delete:
    //  *     tags:
    //  *      - Auth
    //  *     security:
    //  *       - bearer: []
    //  *     summary: Logout the user
    //  *     responses:
    //  *       200:
    //  *         description: Logged out
    //  */
    // this.router.delete(`${this.path}/logout`, async (req: Request, res: Response<DefaultHttpResponse>, next: NextFunction) => {
    //   try {
    //     const resp = await new Auth().logout(req, req.headers)
    //     res.status(resp.httpStatus).send({ code: resp.code, message: resp.message })
    //   } catch (error: unknown) {
    //     next(error as ControllerException)
    //   }
    // })
  }
}
