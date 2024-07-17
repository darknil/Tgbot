import 'dotenv/config'
import { ResponseService } from '../services/response.service.js'
import { TransactionService } from '../services/transaction.service.js'
import { InvoiceDTO } from '../dtos/invoice.dto.js'
import { ApiService } from '../services/api.service.js'
import { JwtService } from '../services/jwt.service.js'
import { errorLogger,dataLogger } from '../logger/logger.js'
export class TransactionController {
  constructor() {
    this.JwtService = new JwtService()
    this.TransactionService = new TransactionService()
    this.ResponseService = new ResponseService()
    this.ApiService = new ApiService()
  }
  createTransaction = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const { email, userChatId } = req.body
      if (!email.endsWith('.com')) {
        return this.ResponseService.badRequest(res, 'Invalid email format')
      }
      const createdTransaction = await this.TransactionService.create(
        email,
        userChatId
      )
      const requestedInvoice = new InvoiceDTO(email)
      const invoice = await this.ApiService.requestInvoice(requestedInvoice)
      await this.TransactionService.updateTransactionField(
        createdTransaction.id,
        'contractId',
        invoice.id
      )
      await this.TransactionService.updateTransactionField(
        createdTransaction.id,
        'paymentUrl',
        invoice.paymentUrl
      )
      return this.ResponseService.success(res, invoice.paymentUrl)
    } catch (error) {
      console.log('create transaction error :', error)
      errorLogger.error('create transaction error :', error)
    }
  }
}
