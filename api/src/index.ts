import express from 'express'
import dotenv from 'dotenv'
import { Route } from './services/routes.model'
import bodyParser from 'body-parser'
import notFoundMiddleware from './middlewares/notfound.middleware'
import errorMiddleware from './middlewares/error.middleware'
import checkerMiddleware from './middlewares/checker.middleware'
import DefaultRouter from './routers/default.router'
import ConfigureRouter from './routers/configure.router'
import AuthRouter from './routers/auth.router'
import EnvRouter from './routers/env.router'
import AdminRouter from './routers/admin.router'
import FilesUpdaterRouter from './routers/filesupdater.router'
import cors from 'cors'
import BootstrapsRouter from './routers/bootstraps.router'
import MaintenanceRouter from './routers/maintenance.router'
import NewsRouter from './routers/news.router'
import BackgroundsRouter from './routers/backgrounds.router'
import StatsRouter from './routers/stats.router'
import { createProxyMiddleware } from 'http-proxy-middleware'

class App {
  private app: express.Application
  private apiPort: number
  private clientPort: number

  /**
   * Initialize the Express application.
   * @param routes The routes to use.
   * @param apiPort The port of the API (default: `3000`).
   * @param clientPort The port of the client (default: `5173` in development, `process.env.PORT` in production). 
   * However, you should not use the API proxy in development (use the client proxy instead).
   */
  constructor(routes: Route[], apiPort?: number, clientPort?: number) {
    this.app = express()
    this.apiPort = apiPort || 3000
    this.clientPort = clientPort || (process.env.PORT ? +process.env.PORT : process.env.NODE_ENV === 'production' ? 4000 : 5173)

    dotenv.config()

    this.init(routes)
  }

  listen() {
    this.app.listen(this.apiPort, () => {
      console.log(`App listening on the port ${this.apiPort}`)
    })
  }

  private init(routes: Route[]) {
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(checkerMiddleware)

    routes.forEach((route) => this.app.use('/api', route.router))

    this.app.use('/files', cors(), express.static('../files/'))

    this.app.use(notFoundMiddleware)
    this.app.use(errorMiddleware)

    this.app.use('/', createProxyMiddleware({ target: `http://localhost:${this.clientPort}`, changeOrigin: true }))
  }
}

new App([
  new DefaultRouter(),
  new EnvRouter(),
  new ConfigureRouter(),
  new AuthRouter(),
  new AdminRouter(),
  new FilesUpdaterRouter(),
  new BootstrapsRouter(),
  new MaintenanceRouter(),
  new NewsRouter(),
  new BackgroundsRouter(),
  new StatsRouter()
]).listen()
