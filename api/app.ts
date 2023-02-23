import bodyParser from 'body-parser';
import express from 'express';
import moment from 'moment';
import checkerMiddleware from './app/middlewares/checker.middleware';
import errorMiddleware from './app/middlewares/error.middleware';
import loggerMiddleware from './app/middlewares/logger.middleware';
import notFountMiddleware from './app/middlewares/not-found.middleware';
import { Route } from './app/models/routes/route.model';
import db from './app/utils/database';
import mysql from 'mysql2'
import dotenv from 'dotenv'

export default class App {
  app: express.Application
  client = __dirname + '/dir/client'

  constructor(routers: Route[]) {
    this.app = express()

    dotenv.config()

    this.initMiddlewares()
    this.initRoutes(routers)
    this.initErrorHandling()
  }

  listen() {
    this.app.listen(3000, () => {
      console.log(`App listening on the port ${3000}`)
    })
  }

  getServer() {
    return this.app
  }

  private initMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(checkerMiddleware)
    this.app.use(loggerMiddleware)
  }

  private initErrorHandling() {
    this.app.use(notFountMiddleware)
    this.app.use(errorMiddleware)
  }

  private initRoutes(routes: Route[]) {
    this.app.use(express.static(this.client))
    routes.forEach((route) => {
      this.app.use('/', route.router)
    })
    this.app.get('/api/test/:id', (req, res) => {
      try {
        db.query('SELECT * FROM config')
        res.send('Success')
      } catch (e) {

      }
    })
  }

}
