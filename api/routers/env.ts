import express from 'express'
import Env from '../models/env';

const router = express.Router()


/**
 * @openapi
 * /env:
 *   get:
 *     tags:
 *       - Environnement
 *     summary: Get environnement
 *     responses:
 *       200:
 *         description: Environnement
 *       400:
 *         description: Unknown error
 */
router.get('/api/env', async (req, res) => {

  const resp = await new Env().env()

  res.status(resp.code).send({ message: resp.message, data: resp.data })

})

export default router
