import express from 'express'
import dotenv from 'dotenv'
import { Route } from './services/routes.model'
import bodyParser from 'body-parser'
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
import rateLimit, { Options } from 'express-rate-limit'
import UpdateRouter from './routers/update.router'
import responseMiddleware from './middlewares/response.middleware'
import { ResponseType } from '../../shared/types/types'
import notFountMiddleware from './middlewares/notfound.middleware'

class App {
  private app: express.Express
  private apiPort: number
  private clientPort: number
  private rateLimiter: Partial<Options>

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
    this.rateLimiter = { windowMs: 60 * 1000 * 10, limit: 500, message: { code: ResponseType.TOO_MANY_REQUESTS_ERROR, message: 'Too many requests' } }

    dotenv.config()

    this.init(routes)
  }

  listen() {
    this.app.listen(this.apiPort, () => {
      console.log(`App listening on the port ${this.apiPort}`)
    })
  }

  private init(routes: Route[]) {
    this.app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json(), responseMiddleware, checkerMiddleware)

    routes.forEach((route) => {
      this.app.use('/api', rateLimit(this.rateLimiter), route.router)
    })

    this.app.use('/files', cors(), express.static('../files/'))

    this.app.use(notFountMiddleware)

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
  new StatsRouter(),
  new UpdateRouter()
]).listen()
