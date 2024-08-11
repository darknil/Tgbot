import { keyboards } from '../config/keyboards.config.js'
import { ChannelService } from '../services/channel.service.js'
import { UserService } from '../../../server/src/services/user.service.js'
export class CommandHandler {
  constructor(bot) {
    this.bot = bot
    this.ChannelService = new ChannelService(bot)
    this.UserService = new UserService()
    this.bot.onText(/\/start/, this.handleUserStart.bind(this))
  }
  async handleUserStart(msg) {
    try {
      const chatId = msg.chat.id || msg.from.id
      const existedUser = this.UserService.getUser(chatId)
      if (!existedUser.email) {
        this.bot.sendPhoto(
          chatId,
          'https://3123703-of06570.twc1.net/images/Frame19.png',
          {
            caption: 'Путь к твоей вершине начинается здесь',
            ...keyboards.emailKeyboard
          }
        )
        return
      }
      const isMember = await this.ChannelService.isMember(chatId)
      if (!existedUser && isMember === 'member') {
        const username = msg.chat.username || ''
        const fistName = msg.chat.first_name || ''
        const lastName = msg.chat.last_name || ''
        this.UserService.createUser(username, fistName, lastName, chatId)
        this.bot.sendPhoto(
          chatId,
          'https://3123703-of06570.twc1.net/images/Frame19.png',
          {
            caption: 'Путь к твоей вершине начинается здесь',
            ...keyboards.emailKeyboard
          }
        )
        return
      }
      if (!existedUser) {
        this.bot.sendPhoto(
          chatId,
          'https://3123703-of06570.twc1.net/images/Frame19.png',
          {
            caption: 'Путь к твоей вершине начинается здесь',
            ...keyboards.emailKeyboard
          }
        )
        return
      }
      this.bot.sendPhoto(
        chatId,
        'https://3123703-of06570.twc1.net/images/Frame19.png',
        {
          caption: 'Путь к твоей вершине начинается здесь'
        }
      )
    } catch (error) {
      console.log('handle user start error', error)
    }
  }
  async handleNewChannelId(msg) {
    try {
    } catch (error) {
      console.log('handle new channel id error', error)
    }
  }
}
