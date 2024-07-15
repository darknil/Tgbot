import mongoose from '../db/db.js'
import { questionSchema } from './question.model.js'
const reportSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  ownerChatId: {
    type: Number,
    required: true
  },
  ownerUsername: {
    type: String,
  },
  userId: {
    type: Number
  },
  photoName: {
    type: String
  },
  photoUrl: {
    type: String
  },
  ownerUuid: {
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
