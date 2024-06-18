import mongoose from '../db/db.js'
const apiSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
const api = mongoose.model('api', apiSchema)
export { apiSchema, api }
