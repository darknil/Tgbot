import mongoose from '../db/db.js'
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  contractId: {
    type: String
  }
})
const product = mongoose.model('product', productSchema)
export { productSchema, product }
