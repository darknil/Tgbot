import mongoose from '../db/db.js'
const UserSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  chatId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
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
  }
})
const User = mongoose.model('User', UserSchema)
export { UserSchema, User }
