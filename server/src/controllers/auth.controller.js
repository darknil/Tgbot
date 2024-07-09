import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
import { JwtService } from '../services/jwt.service.js'
import { TgBot } from '../../../bot/bot.js'
import { TelegramUserIdResolver } from '../utils/TelegramUserIdResolver.js'

import { validate } from '@telegram-apps/init-data-node'
import { parse } from 'querystring'
import 'dotenv/config'
const botToken = process.env.TG_TOKEN
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
    const lowerUsername = userData.username.toLowerCase()
    let user = await this.UserService.getUserByUserName(lowerUsername) /// Переписать под поиск по chatId
    if (user && user.isBanned) {
      throw new Error('User is banned')
    }
    if (!user) {
      user = await this.UserService.createUser(
        userData.username,
        undefined,
        undefined,
        undefined,
        userData.id,
        userData.firstName,
        userData.lastName
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
      const initdata = req.headers.authorization
      if (!initdata) {
        return this.ResponseService.badRequest(res, 'No data provided')
      }
      validate(initdata, botToken)
      const parsedQuery = parse(initdata)
      const userData = JSON.parse(decodeURIComponent(parsedQuery.user))
      let user
      try {
        user = await this.findOrCreateUser(userData)
      } catch (error) {
        if (error.message === 'User is banned') {
          console.log(`User ${userData.id} is banned`)
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
  checkUserStatus = async (req, res) => {
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
      const user = await this.UserService.getUser(decoded.user.id)
      if (!user) {
        return this.ResponseService.notFound(res, 'notfound')
      }
      const status = user.status.value
      if (!status) {
        return this.ResponseService.notFound(res, 'no status')
      }
      return this.ResponseService.success(res, status)
    } catch (error) {
      console.log('check user error', error)
      return this.ResponseService.error(res, 'Error checking user')
    }
  }
}
