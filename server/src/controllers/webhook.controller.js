import { ResponseService } from '../services/response.service'
import { TransactionService } from '../services/transaction.service'
export class WebHookController {
  constructor() {
    this.ResponseService = new ResponseService()
    this.TransactionService = new TransactionService()
  }
  handleWebHook = async (req, res) => {
    try {
      const data = req.body
      console.log('invoice webhook :', data)
      console.log('ivoice buyer :', data.buyer)
      const transaction = await this.TransactionService.getTransaction(
        data.contractId
      )
      if (!transaction) {
        console.log('transaction not found with contractId :', data.contractId)
      }
      await this.TransactionService.updateTransactionFieldByContracId(
        data.contractId,
        'amount',
        data.amount
      )
      await this.TransactionService.updateTransactionFieldByContracId(
        data.contractId,
        'status',
        data.status
      )
      const updated =
        await this.TransactionService.updateTransactionFieldByContracId(
          data.contractId,
          'timestamp',
          data.timestamp
        )
      console.log('updated transaction :', updated)
      return this.ResponseService.success(res, 'webhook received')
    } catch (error) {
      console.log('handle webhook error :', error)
    }
  }
}
