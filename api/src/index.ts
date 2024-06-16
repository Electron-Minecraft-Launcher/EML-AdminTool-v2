import express from 'express'
import dotenv from 'dotenv'
import { Route } from '../../shared/models/routes/routes.model'
import bodyParser from 'body-parser'

class App {
  private app: express.Application
  private port: number
  private client: string

  constructor(routes: Route[], port?: number, client?: string) {
    this.app = express()
    this.port = port || 3000
    this.client = client || __dirname + '/dist/client'

    dotenv.config()

    this.init(routes)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`)
    })
  }

  private init(routes: Route[]) {
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    // this.app.use(checkerMiddleware)
    // this.app.use(loggerMiddleware)

    this.app.use(express.static(this.client))
    routes.forEach(route => {
      this.app.use('/', route.router)
    })
  }
}

new App([]).listen()
