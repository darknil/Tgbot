import mongoose from '../db/db.js'
import { Status } from './status.model.js'
const UserSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  chatId: {
    type: Number
  },
  username: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  mobile: {
    type: String
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status'
  },
  state: {
    type: String
  },
  subscriptionEndDate: {
    type: Date
  }
})
const User = mongoose.model('User', UserSchema)
export { UserSchema, User }
