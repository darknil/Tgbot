import { keyboards } from '../config/keyboards.config.js'
import { ChannelService } from '../services/channel.service.js'
export class CommandHandler {
  constructor(bot) {
    this.bot = bot
    this.ChannelService = new ChannelService(bot)
    this.bot.onText(/\/start/, this.handleUserStart.bind(this))
  }
  async handleUserStart(msg) {
    try {
      const chatId = msg.chat.id || msg.from.id
      const isParticipant = await this.ChannelService.isMember(chatId)
      if (isParticipant) {
        this.bot.sendPhoto(
          chatId,
          'https://3123703-of06570.twc1.net/images/Frame19.png',
          {
            caption: 'Путь к твоей вершине начинается здесь',
            ...keyboards.startKeyboard
          }
        )
      } else {
        this.bot.sendMessage(chatId, 'Hello, welcome to the bot!', keyboards)
      }
    } catch (error) {
      console.log('handle user start error', error)
    }
  }
}
