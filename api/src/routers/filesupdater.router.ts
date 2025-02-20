import { NextFunction, Router, Request, Response } from 'express'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import { Route } from '../services/route.model'
import { ControllerException } from '../responses/types'
import FilesUpdater from '../controllers/filesupdater.controller'
import { File, Loader } from '../../../shared/types/features/file'
import filesUpdaterMiddleware from '../middlewares/filesupdater.middleware'

export default class FilesUpdaterRouter implements Route {
  path = '/files-updater'
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
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
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
    this.router.post(`${this.path}`, filesUpdaterMiddleware, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().uploadFiles(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /files-updater:
     *   put:
     *     tags:
     *      - Files Updater
     *     security:
     *      - bearer: []
     *     summary: Rename file
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               old_path:
     *                 type: string
     *               new_path:
     *                 type: string
     *     responses:
     *       200:
     *         description: File renamed
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().putRenameFile(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /files-updater:
     *   delete:
     *     tags:
     *      - Files Updater
     *     security:
     *      - bearer: []
     *     summary: Delete files
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *     responses:
     *       200:
     *         description: File deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().deleteFiles(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /files-updater/loader:
     *   get:
     *     tags:
     *       - Files Updater
     *     summary: Get loader
     *     responses:
     *       200:
     *         description: Loader
     */
    this.router.get(`${this.path}/loader`, async (req: Request, res: Response<DataHttpResponse<Loader>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().getLoader(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })

    /**
     * @openapi
     * /files-updater/loader:
     *   put:
     *     tags:
     *      - Files Updater
     *     security:
     *      - bearer: []
     *     summary: Change loader
     *     requestBody:
     *       required: true
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               loader:
     *                 type: string
     *               minecraft_version:
     *                 type: string
     *               loader_version:
     *                 type: string
     *     responses:
     *       200:
     *         description: Loader changed
     *       401:
     *         description: Unauthorized
     */
    this.router.put(`${this.path}/loader`, async (req: Request, res: Response<DataHttpResponse<Loader>>, next: NextFunction) => {
      try {
        const resp = await new FilesUpdater().putLoader(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (err: any) {
        res.status(err.httpStatus).send({ code: err.code, message: err.message })
      }
    })
  }
}
