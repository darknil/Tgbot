import { ResponseService } from "../services/response.service.js"
import { UserService } from "../services/user.service.js"
import { TgBot } from "../../../bot/bot.js"
import { ChannelService } from "../../../bot/src/services/channel.service.js"
import { MessageService } from "../../../bot/src/services/message.service.js"
import { StatusService } from "../services/status.service.js"
import { JwtService } from "../services/jwt.service.js"

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
      const status = await this.StatusService.getStatusByUuid(decoded.user.status)
      if(status.value!== 'admin') {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const chatId  = req.params.chatId
      if(!chatId) {
        return this.ResponseService.badRequest(res, 'Missing chatId')
      }
      const user = await this.UserService.getUser(chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'User not found')
      }
      this.UserService.updateUserStatus(user,'banned')
      this.UserService.updateUserField(user.chatId, 'isBanned', true)
      this.ChannelService.kickUser(chatId)
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
        console.log('decoded', decoded)
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const status = await this.StatusService.getStatusByUuid(decoded.user.status)
      if(status.value!== 'admin') {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const chatId  = req.params.chatId
      if(!chatId) {
        return this.ResponseService.badRequest(res, 'Missing chatId')
      }
      const user = await this.UserService.getUser(chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'User not found')
      }
      this.UserService.updateUserStatus(user,'member')
      this.UserService.updateUserField(user.chatId, 'isBanned', false)
      this.ChannelService.unkickUser(chatId)
      this.ChannelService.unbanUser(chatId)
      const link = await this.ChannelService.createInviteLink()
      const message = messages.unbanned +'\n' + link.invite_link
      await this.MessageService.SendMessageToUser(user.chatId, message)
      return this.ResponseService.success(res, 'User unbanned')
    } catch(error) {
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
      const status = await this.StatusService.getStatusByUuid(decoded.user.status)
      if(status.value!== 'admin') {
        console.log('decoded', decoded)
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const chatId  = req.params.chatId
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
  unfreezeUser = async (req,res) =>{
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const status = await this.StatusService.getStatusByUuid(decoded.user.status)
      if(status.value!== 'admin') {
        console.log('decoded', decoded)
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const chatId = req.params.chatId
      if(!chatId) {
        return this.ResponseService.badRequest(res, 'Missing chatId')
      }
      const user = await this.UserService.getUser(chatId)
      if (!user) {
        return this.ResponseService.notFound(res, 'User not found')
      }
      this.UserService.updateUserStatus(user,'member')
      return this.ResponseService.success(res, 'User unfreezed')
    } catch (error) {
      console.log('unfreeze member error', error)
      return this.ResponseService.error
    }
  }
}
