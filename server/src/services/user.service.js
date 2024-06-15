import { User } from '../models/user.model'
export class UserService {
  async createUser(chatId, username, firstName, lastName) {
    try {
      const newUser = new User({ chatId, username, firstName, lastName })
      const savedUser = await newUser.save()
      console.log('User saved successfully:', savedUser)
      return savedUser
    } catch (error) {
      console.log('create user error', error)
    }
  }
  async getUser(chatId) {
    try {
      const user = await User.findById(chatId)
      if (!user) {
        return new Error('User not found')
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
