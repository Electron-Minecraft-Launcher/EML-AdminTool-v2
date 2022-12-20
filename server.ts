import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
const app = express()

const notFoundMiddleware = require('./api/middleware/not-found')

app.use(bodyParser.json())

// Angular
var distDir = __dirname + '/dist/'
app.use(express.static(distDir))


app.get('/api', (req, res) => {
  bodyParser.text({ type: 'text/html' })
  res.send('<h1>EML AdminTool API</h1>')
})

// 404
app.use(notFoundMiddleware)


// Serve
var server = app.listen(8080, () => {
  console.log('API is running on port 8080')
})
