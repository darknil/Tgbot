import mongoose from '../db/db.js'
const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  answer: {
    type: String
  }
})
const question = mongoose.model('Question', questionSchema)
export { questionSchema, question }
