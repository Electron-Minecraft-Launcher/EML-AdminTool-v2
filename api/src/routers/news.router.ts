import { NextFunction, Router, Request, Response } from 'express'
import { DataHttpResponse } from '../../../shared/models/responses/http/data-http-response.model'
import { Route } from '../services/routes.model'
import { ControllerException } from '../responses/types'
import Bootstraps from '../controllers/bootstraps.controller'
import { Maintenance as Maintenance_ } from '../../../shared/models/features/maintenance.model'
import Maintenance from '../controllers/maintenance.controller'
import { News as News_ } from '../../../shared/models/features/news.model'
import News from '../controllers/news.controller'

export default class NewsRouter implements Route {
  path = '/api/news'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /news:
     *   get:
     *     tags:
     *       - News
     *     summary: Get news list
     *     responses:
     *       200:
     *         description: News list
     */
    this.router.get(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<News_[]>>, next: NextFunction) => {
      try {
        const resp = await new News().getNews(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/{news_id}:
     *   get:
     *     tags:
     *       - News
     *     summary: Get a news
     *     parameters:
     *       - in: path
     *         name: news_id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: News
     */
    this.router.get(
      `${this.path}/:news_id`,
      async (req: Request<{ news_id: number }, any, any, any>, res: Response<DataHttpResponse<News_>>, next: NextFunction) => {
        try {
          const resp = await new News().getNews1(req, req.params['news_id'])
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /news:
     *   post:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Add a news
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               content:
     *                 type: string
     *               categories:
     *                 type: string
     *               tags:
     *                 type: string
     *     responses:
     *       200:
     *         description: News added
     *       401:
     *         description: Unauthorized
     */
    this.router.post(`${this.path}`, async (req: Request, res: Response<DataHttpResponse<News_[]>>, next: NextFunction) => {
      try {
        const resp = await new News().postNews(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/{news_id}:
     *   put:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Edit a news
     *     parameters:
     *       - in: path
     *         name: news_id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               content:
     *                 type: string
     *               categories:
     *                 type: string
     *               tags:
     *                 type: string
     *     responses:
     *       200:
     *         description: News updated
     *       401:
     *         description: Unauthorized
     */
    this.router.put(
      `${this.path}/:news_id`,
      async (req: Request<{ news_id: number }, any, any, any>, res: Response<DataHttpResponse<News_[]>>, next: NextFunction) => {
        try {
          const resp = await new News().putNews(req, req.headers, req.body, req.params['news_id'])
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /news/{news_id}:
     *   delete:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Delete a news
     *     parameters:
     *       - in: path
     *         name: news_id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: News deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(
      `${this.path}/:news_id`,
      async (req: Request<{ news_id: number }, any, any, any>, res: Response<DataHttpResponse<News_[]>>, next: NextFunction) => {
        try {
          const resp = await new News().deleteNews(req, req.headers, req.params['news_id'])
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    // /**
    //  * @openapi
    //  * /news/categories/{category_id}:
    //  *   get:
    //  *     tags:
    //  *      - News
    //  *     security:
    //  *      - bearer: []
    //  *     summary: Get news list by category
    //  *     parameters:
    //  *       - in: path
    //  *         name: category
    //  *         required: true
    //  *         schema:
    //  *           type: string
    //  *     responses:
    //  *       200:
    //  *         description: News list
    //  */
    // this.router.put(
    //   `${this.path}/:category_id`,
    //   async (req: Request<{ category_id: number }, any, any, any>, res: Response<DataHttpResponse<News_[]>>, next: NextFunction) => {
    //     try {
    //       const resp = await new Maintenance().updateMaintenanceStatus(req, req.headers, req.body)
    //       res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
    //     } catch (error: unknown) {
    //       next(error as ControllerException)
    //     }
    //   }
    // )
  }
}
