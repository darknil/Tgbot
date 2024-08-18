import { UserService } from '../../../server/src/services/user.service.js'
import { keyboards } from '../config/keyboards.config.js'
export class ChangeEmail {
  constructor(bot) {
    this.bot = bot
    this.UserService = new UserService()
  }
  async proccess(msg) {
    try {
      const chatId = msg.chat.id || msg.from.id
      const message = msg.text
      const userById = await this.UserService.getUser(chatId)
      const userByEmail = await this.UserService.getUserByEmail(message)
    } catch (error) {
      console.log('proccess awaiting email error :', error)
    }
  }
}
