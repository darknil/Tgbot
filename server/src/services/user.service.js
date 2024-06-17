import { User } from '../models/user.model.js'
export class UserService {
  async createUser(chatId, username, firstName, lastName) {
    try {
      const newUser = new User({ chatId, username, firstName, lastName })
      const savedUser = await newUser.save()
      return savedUser
    } catch (error) {
      console.log('create user error', error)
    }
  }
  async getUser(chatId) {
    try {
      const user = await User.findOne({ chatId })
      if (!user) {
        return false
      }
      return user
    } catch (error) {
      console.log('get user error', error)
    }
  }
  async updateUserField(chatId, field, value) {
    try {
    } catch (error) {
      console.log('update user field error', error)
    }
  }
}
