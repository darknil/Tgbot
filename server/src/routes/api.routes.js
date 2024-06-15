import express from 'express'
import { ReportController } from '../controllers/report.controller.js'
import { DaysController } from '../controllers/days.controller.js'
export class ApiRouter {
  constructor(app, controller) {
    this.ReportController = new ReportController()
    this.DaysController = new DaysController()
    this.router = express.Router()
    this.setupRoutes()
  }
  setupRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hello from API')
    })
    this.router.get('/reports', this.ReportController.getAll)
    this.router.get('/days', this.DaysController.getDaysQuantity)
    this.router.get('/days/current', this.DaysController.getCurrentDay)
  }
  getRouter() {
    return this.router
  }
}
