import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
import { JwtService } from '../services/jwt.service.js'
import { StatusService } from '../services/status.service.js'
import { TgBot } from '../../../bot/bot.js'
import { TelegramUserIdResolver } from '../utils/TelegramUserIdResolver.js'

import { validate } from '@telegram-apps/init-data-node'
import { parse } from 'querystring'
import 'dotenv/config'
import { errorLogger, dataLogger } from '../logger/logger.js'
const botToken = process.env.TG_TOKEN
export class AuthController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ChannelService = new ChannelService(botInstance)
    this.UserService = new UserService()
    this.ResponseService = new ResponseService()
    this.JwtService = new JwtService()
    this.StatusService = new StatusService()
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
    try {
      const isMember = await this.ChannelService.isMember(userData.id)
      if (isMember === 'left') {
        this.UserService.updateUserStatus(user,'guest')
      }
      let user = await this.UserService.getUser(userData.id)
      
      if(isMember === 'kicked') {
        this.UserService.updateUserStatus(user,'banned')
      }
      if (!user) {
        try {
          user = await this.UserService.createUser(
            userData.username,
            userData.id,
            userData.first_name,
            userData.last_name
          );
        } catch (error) {
          errorLogger.error('create user error :', error)
          console.log('create user error :', error)
        }
      } else if (user.chatId === 0) {
        user = await this.fillEmptyUser(
          user,
          userData.id,
          userData.first_name,
          userData.last_name
        );
      }
      const UserStatus = await this.StatusService.getStatusByUuid(user.status)

      if(isMember === 'creator' || isMember === 'administrator'){
        user = await this.UserService.updateUserStatus(user, 'admin')
      }
      if (isMember ==='member' && UserStatus.value !== 'freezed') {
        user = await this.UserService.updateUserStatus(user, 'member')
      }
      return user;
    } catch (error) {
      errorLogger.error('find or create user error :', error)
      console.log('find or create user error :', error)
    }

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
          return this.ResponseService.unauthorized(res, 'User is banned')
        }
      }
      if (!user) {
        return this.ResponseService.unauthorized(res, 'User not found in channel')
      }
      const token = this.JwtService.generateToken({ user })
      const expiresOn = this.JwtService.getExpirationTime();
      return this.ResponseService.success(res, token);
    } catch (error) {
      errorLogger.error('verify user membership error', error)
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

      const decoded = this.JwtService.verifyToken(token)
      // console.log('Decoded token payload:', decoded)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      return this.ResponseService.success(res, { valid: true, decoded })
    } catch (error) {
      errorLogger.error('verify token error', error)
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

      const decoded = this.JwtService.verifyToken(token)
      // console.log('Decoded token payload:', decoded)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const user = await this.UserService.getUser(decoded.user.chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'notfound')
      }
      const status = await this.StatusService.getStatusByUuid(decoded.user.status)
      console.log('status :', status)
      if (!status) {
        return this.ResponseService.notFound(res, 'no status')
      }
      return this.ResponseService.success(res, status.value)
    } catch (error) {
      errorLogger.error('check user status error', error)
      console.log('check user status error', error)
      return this.ResponseService.error(res, 'Error checking user')
    }
  }
}
