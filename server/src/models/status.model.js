import mongoose from '../db/db.js'
const StatusSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  value: {
    type: String
  }
})
const Status = mongoose.model('Status', StatusSchema)
export { StatusSchema, Status }
