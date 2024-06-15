import mongoose from '../db/db'
const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
