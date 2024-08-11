import { UserService } from '../../../server/src/services/user.service.js'
import { keyboards } from '../config/keyboards.config.js'
export class AwaitingEmail {
  constructor(bot) {
    this.bot = bot
    this.UserService = new UserService()
  }
  async proccess(msg) {
    try {
      const chatId = msg.chat.id || msg.from.id
      const message = msg.text
      const userById = this.UserService.getUser(chatId)
      const userByEmail = this.UserService.getUserByEmail(message)
      if (userByEmail.chatId) {
        return
      }
      if (!userByEmail) {
        this.UserService.updateUserField(chatId, 'email', message)
        this.UserService.updateUserField(chatId, 'state', 'default')
        this.bot.sendMessage(chatId, 'Почта Добавлена к вашему аккаунту')
        this.bot.sendPhoto(
          chatId,
          'https://3123703-of06570.twc1.net/images/Frame19.png',
          {
            caption: 'Путь к твоей вершине начинается здесь',
            ...keyboards.startKeyboard
          }
        )
      }
      if (!userById.email) {
        await this.UserService.deleteUserByEmail(message)
        this.UserService.updateUserField(chatId, 'email', message)
        this.UserService.updateUserField(chatId, 'state', 'default')
        this.bot.sendMessage(chatId, 'Почта Добавлена к вашему аккаунту')
        this.bot.sendPhoto(
          chatId,
          'https://3123703-of06570.twc1.net/images/Frame19.png',
          {
            caption: 'Путь к твоей вершине начинается здесь',
            ...keyboards.startKeyboard
          }
        )
      }
    } catch (error) {
      console.log('proccess awaiting email error :', error)
    }
  }
}