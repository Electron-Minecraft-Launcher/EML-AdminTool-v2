import express from 'express'
import dotenv from 'dotenv'
import { Route } from '../../shared/models/routes/routes.model'
import bodyParser from 'body-parser'
import notFoundMiddleware from './middlewares/notfound.middleware'
import errorMiddleware from './middlewares/error.middleware'
import checkerMiddleware from './middlewares/checker.middleware'
import DefaultRouter from './routers/default.router'
import ConfigureRouter from './routers/configure.router'
import AuthRouter from './routers/auth.router'
import EnvRouter from './routers/env.router'
import AdminRouter from './routers/admin.router'

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
    this.app.use(express.static(this.client))
    
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(checkerMiddleware)
    // this.app.use(loggerMiddleware)
    
    routes.forEach(route => {
      this.app.use('/', route.router)
    })

    this.app.get('/', (req, res) => {
      res.send('Hello World')
    })
    
    this.app.use(notFoundMiddleware)
    this.app.use(errorMiddleware)
  }
}

new App([new DefaultRouter(), new EnvRouter(), new ConfigureRouter(), new AuthRouter(), new AdminRouter()]).listen()
