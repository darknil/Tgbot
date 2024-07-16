import mongoose from 'mongoose';
import { User } from '../models/user.model.js'
import { Status } from '../models/status.model.js'
export class UserService {
  async createUser(
    username = '',
    chatId = 0,
    firstName = '',
    lastName = '',
    id,
    email = '',
    mobile = '',
  ) {
    if (!id) {
      const lastUser = await User.findOne().sort({ id: -1 }).limit(1)
      id = lastUser ? lastUser.id + 1 : 0;
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
      console.log('get user by username error :', error)
    }
  }
  async updateUserField(chatId, field, value) {
    try {
    } catch (error) {
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
      console.log('update user by username error :', error)
    }
  }
  async getUsers() {
    try {
      const users = await User.find()
      return users
    } catch (error) {
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
      console.log('update user status error :', error)
    }
  }
  async getAdmins(){
    try {
      const users = await User.find({ 'status': new Object('669408eafd0f56d32fe9054f') })
      return users;
    } catch (error) {
      console.log('get admins error :', error)
    }
  }
  async getMembers() {
    try {
      const statusId = new mongoose.Types.ObjectId('669408eafd0f56d32fe90549');
      const users = await User.find({ status: statusId }).populate('status');
      return users;
    } catch (error) {
      console.log('get members error:', error);
    }
  }
}
