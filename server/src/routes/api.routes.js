import express from 'express'
import { ReportController } from '../controllers/report.controller.js'
import { DaysController } from '../controllers/days.controller.js'
import { AuthController } from '../controllers/auth.controller.js'
export class ApiRouter {
  constructor(app, controller) {
    this.ReportController = new ReportController()
    this.DaysController = new DaysController()
    this.AuthController = new AuthController()
    this.router = express.Router()
    this.setupRoutes()
  }
  setupRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hello from API')
    })
    this.router.get('/reports', this.ReportController.getAll)
    this.router.get('/reports/:day', this.ReportController.getReportsbyDay)

    this.router.get('/days', this.DaysController.getDaysQuantity)
    this.router.get('/days/current', this.DaysController.getCurrentDay)

    this.router.post('/auth', this.AuthController.verifyUser)
    this.router.post('/auth/token', this.AuthController.verifyToken)

    this.router.get('/user/report', this.ReportController.getUserReportByDay)
    this.router.post('/user/report', this.ReportController.postUserReport)
    this.router.get('/user/reports', this.ReportController.getUserReports)
  }
  getRouter() {
    return this.router
  }
}
