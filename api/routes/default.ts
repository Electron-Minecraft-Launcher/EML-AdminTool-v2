import express from 'express'
import { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swagger from '../swagger'

const router = express.Router()


router.get('/api', (req: Request, res: Response) => {
  bodyParser.text({ type: 'text/html' })
  res.send(
`<h1>EML AdminTool API</h1>
<p><b>Welcome to the EML AdminTool API</b></p>
<p><a href="./swagger">Swagger</a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="https://github.com/Electron-Minecraft-Launcher" target="_blank">GitHub</a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="https://discord.gg/FePaQ7v" target="_blank">Discord</a></p>`
  )
})

router.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swagger))

export default router