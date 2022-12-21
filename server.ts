import express from 'express'
import bodyParser from 'body-parser'

import notFoundMiddlewareRouter from './api/routes/middlewares/not-found'
import defaultRouter from './api/routes/default'

const app = express()
var distDir = __dirname + '/dist/'


app.use(bodyParser.json())

app.use(express.static(distDir))

app.use(defaultRouter)

app.use(notFoundMiddlewareRouter)


// Serve
var server = app.listen(8080, () => {
  console.log('API is running on port 8080')
})
