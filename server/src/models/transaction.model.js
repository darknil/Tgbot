import mongoose from '../db/db.js'
const TransactionSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  contractId: {
    type: String
  },
  email: {
    type: String
  },
  currency: {
    type: String
  },
  title: {
    type: String
  },
  amount: {
    type: Number
  },
  buyerLanguage: {
    type: String
  },
  paymentUrl: {
    type: String
  },
  userChatId: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date
  },
  status: {
    type: String
  },
  errorMessage: {
    type: String
  }
})
const Transaction = mongoose.model('Transaction', TransactionSchema)
export { TransactionSchema, Transaction }
