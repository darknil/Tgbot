import express from 'express'
import 'dotenv/config'
import { TestController } from '../controllers/test.controller.js'
import { TransactionController } from '../controllers/transaction.controller.js'
export class TestRoute {
  constructor() {
    this.TransactionController = new TransactionController()
    this.TestController = new TestController()
    this.router = express.Router()
    this.mode = process.env.DEVMODE
    if (this.mode === 'dev') {
      this.setupRoutes()
    }
  }
  setupRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hello from test route')
    })
    this.router.get('/test', this.TransactionController.createTransaction)
  }
  getRouter() {
    return this.router
  }
}
