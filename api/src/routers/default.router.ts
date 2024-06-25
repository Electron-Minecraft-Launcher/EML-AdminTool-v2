import { Request, Router } from 'express'
import { Route } from '../services/routes.model'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swagger from '../swagger/swagger'

export default class DefaultRouter implements Route {
  path = '/api'
  router = Router()

  private bodyParser = bodyParser

  constructor() {
    this.init()
  }

  private init() {
    this.router.get(`${this.path}`, (req, res) => {
      this.bodyParser.text({ type: 'text/html' })
      res.send(
        `<h1>EML AdminTool API</h1>
<p><b>Welcome to the EML AdminTool API</b></p>
<p><a href="api/swagger">Swagger</a>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;<a href="https://github.com/Electron-Minecraft-Launcher" target="_blank">GitHub</a>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;<a href="https://discord.gg/6rjpyYskBV" target="_blank">Discord</a></p>`
      )
    })

    this.router.get(`${this.path}/api/swagger.json`, (req, res) => {
      res.send(swagger)
    })

    this.router.use(`${this.path}/swagger`, swaggerUi.serve, swaggerUi.setup(swagger, {}))
  }
}
