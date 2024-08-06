import { NextFunction, Router, Request, Response } from 'express'
import { DataHttpResponse } from '../../../shared/types/responses/http/data-http-response'
import { Route } from '../services/routes.model'
import { ControllerException } from '../responses/types'
import { NewsCategory, NewsCategoryRes, NewsTag, News as News_ } from '../../../shared/types/features/news'
import News from '../controllers/news.controller'
import { File } from '../../../shared/types/features/file'
import imagesMiddleware from '../middlewares/images.middleware'

export default class NewsRouter implements Route {
  path = '/news'
  router = Router()

  constructor() {
    this.init()
  }

  private init() {
    /**
     * @openapi
     * /news/categories:
     *   get:
     *     tags:
     *      - News
     *     summary: Get categories list
     *     responses:
     *       200:
     *         description: Categories list
     */
    this.router.get(`${this.path}/categories`, async (req: Request, res: Response<DataHttpResponse<NewsCategory[]>>, next: NextFunction) => {
      try {
        const resp = await new News().getCategories(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/categories/{category_id}:
     *   get:
     *     tags:
     *      - News
     *     parameters:
     *       - in: path
     *         name: category_id
     *         required: true
     *         schema:
     *           type: number
     *     summary: Get category
     *     responses:
     *       200:
     *         description: Category
     */
    this.router.get(
      `${this.path}/categories/:category_id`,
      async (req: Request<{ category_id: number }, any, any, any>, res: Response<DataHttpResponse<NewsCategoryRes>>, next: NextFunction) => {
        try {
          const resp = await new News().getCategory(req, req.params.category_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /news/categories:
     *   post:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Add a category
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *     responses:
     *       200:
     *         description: Category added
     *       401:
     *         description: Unauthorized
     */
    this.router.post(`${this.path}/categories`, async (req: Request, res: Response<DataHttpResponse<NewsCategory[]>>, next: NextFunction) => {
      try {
        const resp = await new News().postCategory(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/categories/{category_id}:
     *   put:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Edit a category
     *     parameters:
     *       - in: path
     *         name: category_id
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
     *     responses:
     *       200:
     *         description: Category updated
     *       401:
     *         description: Unauthorized
     */
    this.router.put(
      `${this.path}/categories/:category_id`,
      async (req: Request<{ category_id: number }, any, any, any>, res: Response<DataHttpResponse<NewsCategory[]>>, next: NextFunction) => {
        try {
          const resp = await new News().putCategory(req, req.headers, req.body, req.params.category_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /news/categories/{category_id}:
     *   delete:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Delete a category
     *     parameters:
     *       - in: path
     *         name: category_id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Category deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(
      `${this.path}/categories/:category_id`,
      async (req: Request<{ category_id: number }, any, any, any>, res: Response<DataHttpResponse<NewsCategory[]>>, next: NextFunction) => {
        try {
          const resp = await new News().deleteCategory(req, req.headers, req.params.category_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    //* Tags ====================================

    /**
     * @openapi
     * /news/tags:
     *   get:
     *     tags:
     *      - News
     *     summary: Get tags list
     *     responses:
     *       200:
     *         description: Tags list
     */
    this.router.get(`${this.path}/tags`, async (req: Request, res: Response<DataHttpResponse<NewsTag[]>>, next: NextFunction) => {
      try {
        const resp = await new News().getTags(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/tags/{tag_id}:
     *   get:
     *     tags:
     *      - News
     *     parameters:
     *       - in: path
     *         name: tag_id
     *         required: true
     *         schema:
     *           type: number
     *     summary: Get tag
     *     responses:
     *       200:
     *         description: Tag
     */
    this.router.get(
      `${this.path}/tags/:tag_id`,
      async (req: Request<{ tag_id: number }, any, any, any>, res: Response<DataHttpResponse<NewsTag>>, next: NextFunction) => {
        try {
          const resp = await new News().getTag(req, req.params.tag_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /news/tags:
     *   post:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Add a tag
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               color:
     *                 type: string
     *     responses:
     *       200:
     *         description: Tag added
     *       401:
     *         description: Unauthorized
     */
    this.router.post(`${this.path}/tags`, async (req: Request, res: Response<DataHttpResponse<NewsTag[]>>, next: NextFunction) => {
      try {
        const resp = await new News().postTag(req, req.headers, req.body)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/tags/{tag_id}:
     *   put:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Edit a tag
     *     parameters:
     *       - in: path
     *         name: tag_id
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
     *               color:
     *                 type: string
     *     responses:
     *       200:
     *         description: Tag updated
     *       401:
     *         description: Unauthorized
     */
    this.router.put(
      `${this.path}/tags/:tag_id`,
      async (req: Request<{ tag_id: number }, any, any, any>, res: Response<DataHttpResponse<NewsTag[]>>, next: NextFunction) => {
        try {
          const resp = await new News().putTag(req, req.headers, req.body, req.params.tag_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    /**
     * @openapi
     * /news/tags/{tag_id}:
     *   delete:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Delete a tag
     *     parameters:
     *       - in: path
     *         name: tag_id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Tag deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(
      `${this.path}/tags/:tag_id`,
      async (req: Request<{ tag_id: number }, any, any, any>, res: Response<DataHttpResponse<NewsTag[]>>, next: NextFunction) => {
        try {
          const resp = await new News().deleteTag(req, req.headers, req.params.tag_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    //* Images ==================================

    /**
     * @openapi
     * /news/images:
     *   get:
     *     tags:
     *      - News
     *     summary: Get images list
     *     responses:
     *       200:
     *         description: Images list
     */
    this.router.get(`${this.path}/images`, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new News().getImages(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/images:
     *   post:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Add an image
     *     requestBody:
     *       required: false
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               files[]:
     *                 type: file
     *     responses:
     *       200:
     *         description: Image added
     *       401:
     *         description: Unauthorized
     */
    this.router.post(`${this.path}/images`, imagesMiddleware, async (req: Request, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
      try {
        const resp = await new News().uploadImage(req)
        res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
      } catch (error: unknown) {
        next(error as ControllerException)
      }
    })

    /**
     * @openapi
     * /news/images:
     *   delete:
     *     tags:
     *       - News
     *     security:
     *       - bearer: []
     *     summary: Delete an image
     *     requestBody:
     *       required: false
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               paths:
     *                 type: string
     *     responses:
     *       200:
     *         description: Image deleted
     *       401:
     *         description: Unauthorized
     */
    this.router.delete(
      `${this.path}/images/`,
      async (req: Request<{ images_paths: number }, any, any, any>, res: Response<DataHttpResponse<File[]>>, next: NextFunction) => {
        try {
          const resp = await new News().deleteImage(req, req.headers, req.body)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )

    //* News ====================================

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
     *           type: number
     *     responses:
     *       200:
     *         description: News
     */
    this.router.get(
      `${this.path}/:news_id`,
      async (req: Request<{ news_id: number }, any, any, any>, res: Response<DataHttpResponse<News_>>, next: NextFunction) => {
        try {
          const resp = await new News().getNews1(req, req.params.news_id)
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
          const resp = await new News().putNews(req, req.headers, req.body, req.params.news_id)
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
          const resp = await new News().deleteNews(req, req.headers, req.params.news_id)
          res.status(resp.httpStatus).send({ code: resp.code, message: resp.message, data: resp.data })
        } catch (error: unknown) {
          next(error as ControllerException)
        }
      }
    )
  }
}
