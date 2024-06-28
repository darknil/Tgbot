import express from 'express'
export class WebHookRouter {
  constructor(app, controller) {
    this.router = express.Router()
    this.setupRoutes()
  }
  setupRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hello from WebHook')
    })
  }
  getRouter() {
    return this.router
  }
}
