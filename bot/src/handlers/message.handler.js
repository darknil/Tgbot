import { keyboards } from '../config/keyboards.config.js'
import { ChannelService } from '../services/channel.service.js'
import isAdmin from '../services/isAdmin.js'
import { KickUserFromChannel } from '../services/kickUserFromChannel.js'
import fs from 'fs'
import { UserService } from '../../../server/src/services/user.service.js'

import { AwaitingEmail } from '../states/awaitingEmail.js'

export class MessageHandler {
  constructor(bot) {
    this.bot = bot
    this.ChannelService = new ChannelService(bot)
    this.UserService = new UserService()
    this.KickUserFromChannel = new KickUserFromChannel(bot)
    this.bot.on('message', (msg) => {
      this.handleUserMessage(msg)
    })

    this.AwaitingEmail = new AwaitingEmail(bot)
  }
  async handleUserMessage(msg) {
    try {
      const chatId = msg.chat.id || msg.from.id
      const valide = this.validateMessage(msg)
      if (!valide) {
        return
      }
      if (msg.chat.type !== 'private') {
        return
      }
      console.log('test')
      const user = await this.UserService.getUser(chatId)
      console.log('user :', user)
      switch (user.state) {
        case 'awaiting_email':
          this.AwaitingEmail.proccess(msg)
          break
        default:
          break
      }
    } catch (error) {
      console.log('Error handling user message:', error)
    }
  }
  validateMessage(message) {
    if (message.text && message.text.startsWith('/')) {
      return false
    }
    if (message.photo && message.photo.length) {
      return false
    }
    if (message.text && message.text.length > 200) {
      return false
    }
    if (message.location) {
      return false
    }
    return true
  }
}
