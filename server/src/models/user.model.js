import mongoose from '../db/db'
const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
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
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
})
const User = mongoose.model('User', UserSchema)
export { UserSchema, User }
