import express from 'express'
import { WebHookController } from '../controllers/webhook.controller.js'
import { GetcourseWebhookController } from '../controllers/getcourse.webhook.js'
export class WebHookRouter {
  constructor() {
    this.WebHookController = new WebHookController()
    this.GetcourseWebhookController = new GetcourseWebhookController()
    this.router = express.Router()
    this.setupRoutes()
  }
  setupRoutes() {
    this.router.post('/', this.WebHookController.handleWebHook)
    this.router.post(
      '/getcourse',
      this.GetcourseWebhookController.handleWebHook
    )
  }
  getRouter() {
    return this.router
  }
}
