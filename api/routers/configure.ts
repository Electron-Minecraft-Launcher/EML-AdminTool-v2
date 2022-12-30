import { DefaultResponse } from '../types/response'
import express, { Request, Response } from 'express'
import Configure from '../models/configure';

const router = express.Router()


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
 *       400:
 *         description: Unknown error
 *       401:
 *         description: Unauthorized
 */
router.put('/api/configure/language', async (req: Request, res: Response<DefaultResponse>) => {

  const body = req.body

  const resp = await new Configure().language(body)

  res.status(resp.code).send({ message: resp.message })

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
 *       400:
 *         description: Unknown error
 *       401:
 *         description: Unauthorized
 */
router.put('/api/configure/database', async (req: Request, res: Response<DefaultResponse>) => {

  const body = req.body

  const resp = await new Configure().database(body)

  res.status(resp.code).send({ message: resp.message })

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
 *       400:
 *         description: Unknown error
 *       401:
 *         description: Unauthorized
 */
router.put('/api/configure/admin', async (req: Request, res: Response<DefaultResponse>) => {

  const body = req.body

  const resp = await new Configure().admin(body)

  res.status(resp.code).send({ message: resp.message })

})

export default router
