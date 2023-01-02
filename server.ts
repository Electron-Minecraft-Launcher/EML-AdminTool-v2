import express from 'express'
import bodyParser from 'body-parser'
import {db} from './api/utils/database'

import checkerMiddlewareRouter from './api/routers/middlewares/checker'
import notFoundMiddlewareRouter from './api/routers/middlewares/not-found'
import defaultRouter from './api/routers/default'
import configureRouter from './api/routers/configure'
import envRouter from './api/routers/env'

const app = express()
var distDir = __dirname + '/dist/'

app.use(checkerMiddlewareRouter)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(distDir))

app.use(defaultRouter)
app.use(configureRouter)
app.use(envRouter)

app.get('/api/test/:id', (req, res) => {
  db.query('SELECT * FROM config', (err, result) => {
    res.send({ data: result, db: process.env['DATABASE_PASSWORD'] })
  })
})
app.use(notFoundMiddlewareRouter)



app.listen(3000, () => {
  console.log('API is running on port 3000')
})
