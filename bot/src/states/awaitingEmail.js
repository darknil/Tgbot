import { UserService } from '../../../server/src/services/user.service.js'
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
        this.bot.sendMessage(chatId, 'Почта Добавлена к вашему аккаунту')
      }
      if (!userById.email) {
        await this.UserService.deleteUserByEmail(message)
        this.UserService.updateUserField(chatId, 'email', message)
        this.bot.sendMessage(chatId, 'Почта Добавлена к вашему аккаунту')
      }
    } catch (error) {
      console.log('proccess awaiting email error :', error)
    }
  }
}
