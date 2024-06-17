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
