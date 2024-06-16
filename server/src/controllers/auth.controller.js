import validateUserData from '../utils/userValidator.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { ResponseService } from '../services/response.service.js'
import { JwtService } from '../services/jwt.service.js'
import { TgBot } from '../../../bot/bot.js'
export class AuthController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ChannelService = new ChannelService(botInstance)
    this.ResponseService = new ResponseService()
    this.JwtService = new JwtService()
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
      const token = this.JwtService.generateToken({
        user: userData.user
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
      console.log('Decoded token payload:', decoded)
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
