import { keyboards } from '../config/keyboards.config.js'
import { ChannelService } from '../services/channel.service.js'
import isAdmin from '../services/isAdmin.js'
import { KickUserFromChannel } from '../services/kickUserFromChannel.js'
export class MessageHandler {
  constructor(bot) {
    this.bot = bot
    this.ChannelService = new ChannelService(bot)
    this.KickUserFromChannel = new KickUserFromChannel(bot)
    this.bot.on('message', (msg) => {
      this.handleUserMessage(msg)
    })
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
      const isParticipant = await this.ChannelService.isMember(chatId)

      if (isParticipant) {
        this.bot.sendMessage(
          chatId,
          'Welcome to our bot',
          keyboards.startKeyboard
        )
        const Admin = isAdmin(chatId)
        if (Admin) {
          await this.KickUserFromChannel.kickUser()
        }
      } else {
        this.bot.sendMessage(chatId, 'you are not a participant')
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
