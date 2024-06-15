import express from 'express'
import { ApiRouter } from './src/routes/api.routes.js'
export class ExpressServer {
  constructor(port) {
    this.app = express()
    this.api = new ApiRouter(this.app)
    this.startServer(port)
    this.setupRoutes()
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
    this.app.use('/api', this.api.getRouter())
  }
}
