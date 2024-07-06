import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { ApiRouter } from './src/routes/api.routes.js'
import { WebHookRouter } from './src/routes/webhook.routes.js'
import { TestRoute } from './src/routes/test.routes.js'
import { scheduleCloseReports } from './src/cron/cronJob.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class ExpressServer {
  constructor(port) {
    this.app = express()
    this.api = new ApiRouter(this.app)
    this.webhook = new WebHookRouter(this.app)
    this.test = new TestRoute(this.app)
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
    this.app.use('/test', this.test.getRouter())
    this.app.use('/webhook', this.webhook.getRouter())
    // Serve notfound.html for all other routes (404 Not Found)
    this.app.use((req, res) => {
      const publicPath = path.resolve(__dirname, '../public')
      res.status(404).sendFile(path.join(publicPath, 'notfound.html'))
    })
  }
  setupMiddleware() {
    this.app.use(cors())

    this.app.use(morgan('dev'))
    this.app.use(bodyParser.json({ limit: '100mb' }))
    this.app.use(express.static(path.join(__dirname, '../public')))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }
}
