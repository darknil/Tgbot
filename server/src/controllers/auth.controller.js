import validateUserData from '../utils/userValidator.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
import { JwtService } from '../services/jwt.service.js'
import { TgBot } from '../../../bot/bot.js'
import { TelegramUserIdResolver } from '../utils/TelegramUserIdResolver.js'
export class AuthController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ChannelService = new ChannelService(botInstance)
    this.UserService = new UserService()
    this.ResponseService = new ResponseService()
    this.JwtService = new JwtService()
    this.TelegramUserIdResolver = new TelegramUserIdResolver(
      '../config/users.csv'
    )
  }
  fillEmptyUser = async (user, chatId, firstName, lastName) => {
    try {
      await this.UserService.updateUserByUsername(
        user.username,
        'chatId',
        chatId
      )
      await this.UserService.updateUserByUsername(
        user.username,
        'firstName',
        firstName
      )
      const updatedLastname = await this.UserService.updateUserByUsername(
        user.username,
        'lastName',
        lastName
      )

      return updatedLastname
    } catch (error) {
      console.log('fill empty user fields error :', error)
    }
  }
  findOrCreateUser = async (userData) => {
    const lowerUsername = userData.user.username.toLowerCase()
    let user = await this.UserService.getUserByUserName(lowerUsername)
    if (user && user.isBanned) {
      throw new Error('User is banned')
    }
    if (!user) {
      user = await this.UserService.createUser(
        userData.user.username,
        undefined,
        undefined,
        undefined,
        userData.user.id,
        userData.user.firstName,
        userData.user.lastName
      )
    }
    if (user.chatId === 0) {
      user = await this.fillEmptyUser(
        user,
        userData.user.id,
        userData.user.firstName,
        userData.user.lastName
      )
    }
    return user
  }
  verifyUser = async (req, res) => {
    try {
      const userData = req.body
      if (!userData) {
        return this.ResponseService.badRequest(res, 'No data provided')
      }
      // const isValidUser = await validateUserData(userData, process.env.TG_TOKEN)
      // if (!isValidUser) {
      //     return this.ResponseService.unauthorized(res, 'Invalid user data')
      // }
      const isMember = await this.ChannelService.isMember(userData.user.id)
      if (!isMember) {
        return this.ResponseService.unauthorized(res, 'User is not a member') /// сделать условие наличия пользователя в базе данных и проверку isbanned
      }
      let user
      try {
        user = await this.findOrCreateUser(userData)
      } catch (error) {
        if (error.message === 'User is banned') {
          console.log(`User ${userData.user.id} is banned`)
          return this.ResponseService.unauthorized(res, 'User is banned')
        }
      }
      const token = this.JwtService.generateToken({ user })
      return this.ResponseService.success(res, token)
    } catch (error) {
      console.log('verify user membership error', error)
      return this.ResponseService.error(res, 'Error verifying user membership')
    }
  }
  verifyToken = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }

      const decoded = this.JwtService.verifyToken(token.replace('Bearer ', ''))
      // console.log('Decoded token payload:', decoded)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      return this.ResponseService.success(res, { valid: true, decoded })
    } catch (error) {
      console.log('verify token error', error)
      return this.ResponseService.error(res, 'Error verify token')
    }
  }
}
