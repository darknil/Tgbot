import { ResponseService } from "../services/response.service.js"
import { UserService } from "../services/user.service"
import { TgBot } from "../../../bot/bot"
import { ChannelService } from "../../../bot/src/services/channel.service"
import { MessageService } from "../../../bot/src/services/message.service.js"
import { StatusService } from "../services/status.service"
import { JwtService } from "../services/jwt.service"

import { messages } from "../config/messages.config.js"
import isAdmin from "../../../bot/src/services/isAdmin.js"
export class AdminController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.UserService = new UserService()
    this.StatusService = new StatusService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
    this.JwtService = new JwtService()
  }
  banUser = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const admin = isAdmin(decoded.user.chatId)
      if(!admin) {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const { chatId } = req.params.chatId
      if(!chatId) {
        return this.ResponseService.badRequest(res, 'Missing chatId')
      }
      const user = await this.UserService.getUser(chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'User not found')
      }
      this.UserService.updateUserStatus(user,'banned')
      this.UserService.updateUserByUsername(username, 'isBanned', true)
      this.ChannelService.banUser(chatId)
      return this.ResponseService.success(res, 'User banned')
    } catch (error) {
      console.log('ban user error', error)
      return this.ResponseService.error(res, 'Error banning user')
    }
  }
  unbanUser = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const admin = isAdmin(decoded.user.chatId)
      if(!admin) {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const { chatId } = req.params.chatId
      if(!chatId) {
        return this.ResponseService.badRequest(res, 'Missing chatId')
      }
      const user = await this.UserService.getUser(chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'User not found')
      }
      this.UserService.updateUserStatus(user,'member')
      this.UserService.updateUserByUsername(username, 'isBanned', false)
      this.ChannelService.unbanUser(chatId)
      const link = await this.ChannelService.createInviteLink()
      await this.MessageService.SendMessageToUser(user.chatId, `${messages.unbanned}\n ${link}`)
      return this.ResponseService.success(res, 'User unbanned')
    } catch {
      console.log('unban user error', error)
      return this.ResponseService.error(res, 'Error unbanning user')
    }
  }
  freezeUser = async (req,res) =>{
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const admin = isAdmin(decoded.user.chatId)
      if(!admin) {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const { chatId } = req.params.chatId
      if(!chatId) {
        return this.ResponseService.badRequest(res, 'Missing chatId')
      }
      const user = await this.UserService.getUser(chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'User not found')
      }
      this.UserService.updateUserStatus(user,'freezed')
      return this.ResponseService.success(res, 'User freezed')
    } catch (error) {
      console.log('freeze member error', error)
      return this.ResponseService.error(res, 'freeze member error')
    }
  }
}
