import express from 'express'
import { WebHookController } from '../controllers/webhook.controller.js'
export class WebHookRouter {
  constructor() {
    this.WebHookController = new WebHookController()
    this.router = express.Router()
    this.setupRoutes()
  }
  setupRoutes() {
    this.router.get('/', this.WebHookController.handleWebHook)
  }
  getRouter() {
    return this.router
  }
}
