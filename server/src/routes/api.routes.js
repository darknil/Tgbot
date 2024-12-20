import express from 'express'
import { ReportController } from '../controllers/report.controller.js'
import { DaysController } from '../controllers/days.controller.js'
import { AuthController } from '../controllers/auth.controller.js'
import { FileController } from '../controllers/file.controller.js'
import { TransactionController } from '../controllers/transaction.controller.js'
import { TestController } from '../controllers/test.controller.js'
import { UserController } from '../controllers/user.controller.js'
import { AdminController } from '../controllers/admin.controller.js'
export class ApiRouter {
  constructor() {
    this.ReportController = new ReportController()
    this.DaysController = new DaysController()
    this.AuthController = new AuthController()
    this.FileController = new FileController()
    this.TransactionController = new TransactionController()
    this.TestController = new TestController()
    this.UserController = new UserController()
    this.AdminController = new AdminController()
    this.router = express.Router()
    this.setupRoutes()
  }
  setupRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hello from API')
    })
    this.router.get('/reports', this.ReportController.fetchReports) // убрать токен авторизации
    this.router.get('/reports/:day', this.ReportController.getReportsbyDay)

    this.router.get('/days', this.DaysController.getDaysQuantity)
    this.router.get('/days/current', this.DaysController.getCurrentDay)

    this.router.post('/auth', this.AuthController.verifyUser)
    this.router.post('/auth/status', this.AuthController.checkUserStatus)
    this.router.post('/auth/token', this.AuthController.verifyToken)

    this.router.get('/user/report', this.ReportController.getUserReportByDay)
    this.router.post('/user/report', this.ReportController.postUserReport)
    this.router.get('/user/reports', this.ReportController.getUserReports)

    this.router.get('/users',this.UserController.getMembers)
    this.router.post('/user/:chatId/ban',this.AdminController.banUser)
    this.router.post('/user/:chatId/unban',this.AdminController.unbanUser)
    this.router.post('/user/:chatId/freeze',this.AdminController.freezeUser)
    this.router.post('/user/:chatId/unfreeze',this.AdminController.unfreezeUser)


    this.router.post(
      '/file/:reportId/image',
      this.FileController.uploadReportImage
    )

    this.router.post(
      '/transaction',
      this.TransactionController.createTransaction
    )

  }
  getRouter() {
    return this.router
  }
}
