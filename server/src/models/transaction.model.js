import mongoose from '../db/db.js'
const TransactionSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  email: {
    type: String
  },
  userChatId: {
    type: String
  },
  isPaid: {
    type: Boolean
  }
})
const Transaction = mongoose.model('Transaction', TransactionSchema)
export { TransactionSchema, Transaction }
