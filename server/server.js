import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import { ApiRouter } from './src/routes/api.routes.js'
import { scheduleCloseReports } from './src/cron/cronJob.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class ExpressServer {
  constructor(port) {
    this.app = express()
    this.api = new ApiRouter(this.app)
    this.setupMiddleware()
    this.setupRoutes()
    this.startServer(port)
    scheduleCloseReports()
  }
  startServer(port) {
    const PORT = port || 4000
    this.app.listen(PORT, async () => {
      console.log(`Server started on port ${PORT}`)
      console.log(`Server URL: http://localhost:${PORT}`)
      console.log('===============================================')
    })
  }
  setupRoutes() {
    this.app.get('/', (req, res) => {
      const publicPath = path.resolve(__dirname, '../public')
      res.sendFile(path.join(publicPath, 'index.html'))
    })
    this.app.use('/api', this.api.getRouter())
  }
  setupMiddleware() {
    this.app.use(morgan('dev'))
    this.app.use(bodyParser.json())
    this.app.use(express.static(path.join(__dirname, '../public')))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }
}
