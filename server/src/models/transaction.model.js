import mongoose from '../db/db.js'
const TransactionSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  email: {
    type: String
  }
})
const Transaction = mongoose.model('Transaction', TransactionSchema)
export { TransactionSchema, Transaction }
