import 'dotenv/config'
import { ResponseService } from '../services/response.service'
import { TransactionService } from '../services/transaction.service'
import { InvoiceDTO } from '../dtos/invoice.dto'
import { ApiService } from '../services/api.service'
import { JwtService } from '../services/jwt.service'
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
      const createdTransaction = await this.TransactionService.create(
        email,
        userChatId
      )
      const requestedInvoice = new InvoiceDTO(email)
      const invoice = await this.ApiService.requestInvoice(requestedInvoice)
      await this.TransactionService.updateTransactionField(
        createdTransaction.id,
        'contractId',
        invoice.contractId
      )
      await this.TransactionService.updateTransactionField(
        createdTransaction.id,
        'paymentUrl',
        invoice.paymentUrl
      )
      return this.ResponseService.success(res, invoice.paymentUrl)
    } catch (error) {
      console.log('create transaction error :', error)
    }
  }
}
