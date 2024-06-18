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
  verifyUser = async (req, res) => {
    try {
      const userData = req.body
      if (!userData) {
        return ResponseService.badRequest(res, 'No data provided')
      }
      const isValidUser = await validateUserData(userData, process.env.TG_TOKEN)
      if (!isValidUser) {
        return ResponseService.unauthorized(res, 'Invalid user data')
      }
      const isMember = await this.ChannelService.isMember(userData.user.id)
      if (!isMember) {
        return ResponseService.unauthorized(res, 'User is not a member')
      }
      let existingUser = await this.UserService.getUser(userData.user.id)
      if (!existingUser) {
        const csvUserInfo =
          await this.TelegramUserIdResolver.getUserInfoByTelegramUsername(
            userData.user.username
          )
        if (csvUserInfo) {
          existingUser = await this.UserService.createUser(
            csvUserInfo.UID,
            userData.user.username,
            userData.user.first_name,
            userData.user.last_name,
            csvUserInfo.Email,
            csvUserInfo.mobile
          )
        } else {
          existingUser = await this.UserService.createUser(
            userData.user.id,
            userData.user.username,
            userData.user.first_name,
            userData.user.last_name
          )
        }
      }
      const token = this.JwtService.generateToken({
        user: existingUser
      })
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
