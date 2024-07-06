import { Transaction } from '../models/transaction.model'
export class TransactionService {
  async create(email, userChatId, currency = 'RUB', buyerLanguage = 'RU') {
    try {
      const lastTransaction = await Transaction.findOne()
        .sort({ id: -1 })
        .exec()
      const id = lastTransaction ? lastTransaction.id + 1 : 0
      const newTransaction = new Transaction({
        id,
        email,
        currency,
        buyerLanguage,
        userChatId
      })
      const savedTransaction = await newTransaction.save()
      return savedTransaction
    } catch (error) {
      console.log('creating transaction error :', error)
      return false
    }
  }
  async updateTransactionField(id, field, value) {
    try {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { id: id },
        { $set: { [field]: value } },
        { new: true }
      )
      console.log(`Transaction updated: ${updatedTransaction}`)
      return updatedTransaction
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  }
  async getTransaction(contractId) {
    try {
      const transaction = await Transaction.findOne({ contractId: contractId })
      if (!transaction) {
        return false
      }
      return transaction
    } catch (error) {
      console.log('get transaction error :', error)
    }
  }
  async updateTransactionFieldByContracId(contractId, field, value) {
    try {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { contractId: contractId },
        { $set: { [field]: value } },
        { new: true }
      )
      console.log(`Transaction updated: ${updatedTransaction}`)
      return updatedTransaction
    } catch (error) {
      console.log('update transaction error :', error)
    }
  }
}
