import mongoose from '../db/db'
import { questionSchema } from './question.model'
const reportSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  date: {
    type: Date
  },
  isClosed: {
    type: Boolean,
    default: false
  }
})
const Report = mongoose.model('Report', reportSchema)

export { reportSchema, Report }
