import mongoose from 'mongoose'
import { User } from '../models/user.model.js'
import { Status } from '../models/status.model.js'
import { errorLogger, dataLogger } from '../logger/logger.js'
export class UserService {
  async createUser(
    username = '',
    chatId = 0,
    firstName = '',
    lastName = '',
    id,
    email = '',
    mobile = ''
  ) {
    if (!id) {
      const lastUser = await User.findOne().sort({ id: -1 }).limit(1)
      id = lastUser ? lastUser.id + 1 : 0
    }
    try {
      console.log('user id :', id)
      const newUser = new User({
        username,
        id,
        email,
        mobile,
        chatId,
        firstName,
        lastName
      })
      const savedUser = await newUser.save()
      return savedUser
    } catch (error) {
      errorLogger.error('create user error', error)
      console.log('create user error', error)
      return null
    }
  }
  async getUser(chatId) {
    try {
      const user = await User.findOne({ chatId })
      if (!user) {
        return null
      }
      return user
    } catch (error) {
      errorLogger.error('get user error', error)
      console.log('get user error', error)
    }
  }
  async getUserByUserName(username) {
    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return false
      }
      return user
    } catch (error) {
      errorLogger.error('get user by username error', error)
      console.log('get user by username error :', error)
    }
  }
  async updateUserField(chatId, field, value) {
    try {
      const user = await User.findOne({ chatId })
      if (!user) {
        return false
      }
      user[field] = value
      const updatedUser = await user.save()
      return updatedUser
    } catch (error) {
      errorLogger.error('update user field error', error)
      console.log('update user field error', error)
    }
  }
  async updateUserByUsername(username, field, value) {
    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return false
      }
      user[field] = value
      const updatedUser = await user.save()
      return updatedUser
    } catch (error) {
      errorLogger.error('update user by username error', error)
      console.log('update user by username error :', error)
    }
  }
  async getUsers() {
    try {
      const users = await User.find()
      return users
    } catch (error) {
      errorLogger.error('get all users error', error)
      console.log('get all users error :', error)
    }
  }
  async updateUserStatus(user, statusValue) {
    try {
      const status = await Status.findOne({ value: statusValue })
      if (!status) {
        throw new Error('Status not found')
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { status: status._id },
        { new: true }
      )

      if (!updatedUser) {
        throw new Error('User not found')
      }
      return updatedUser
    } catch (error) {
      errorLogger.error('update user status error', error)
      console.log('update user status error :', error)
    }
  }
  async getAdmins() {
    try {
      const users = await User.find({
        status: new Object('669408eafd0f56d32fe9054f')
      })
      return users
    } catch (error) {
      errorLogger.error('get admins error', error)
      console.log('get admins error :', error)
    }
  }
  async getMembers() {
    try {
      const statusId = new mongoose.Types.ObjectId('669408eafd0f56d32fe90549')
      const users = await User.find({ status: statusId })
      return users
    } catch (error) {
      errorLogger.error('get members error', error)
      console.log('get members error:', error)
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return false
      }
      return user
    } catch (error) {
      errorLogger.error('get user by email error', error)
      console.log('get user by email error :', error)
    }
  }
  async deleteUser(chatId) {
    try {
      const user = await User.findOne({ chatId })
      if (!user) {
        return false
      }
      await user.deleteOne()
      return true
    } catch (error) {
      errorLogger.error('delete user error', error)
      console.log('delete user error :', error)
    }
  }
  async deleteUserByEmail(email) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return false
      }
      await user.deleteOne()
      return true
    } catch (error) {
      errorLogger.error('delete user by email error', error)
      console.log('delete user by email error :', error)
    }
  }
}
