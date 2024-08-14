import { UserService } from '../../../server/src/services/user.service.js'
export class QueryHandler {
  constructor(bot) {
    this.bot = bot
    bot.on('callback_query', this.handleQuery.bind(this))
    this.UserService = new UserService()
  }
  async handleQuery(query) {
    try {
      const data = query.data
      const chatId = query.from.id
      switch (data) {
        case 'email_connect':
          await this.handleEmailConnect(chatId)
          break
      }
    } catch (error) {
      console.log('handle query error', error)
    }
  }

  async handleEmailConnect(chatId) {
    this.UserService.updateUserField(chatId, 'state', 'awaiting_email')
    await this.bot.sendMessage(
      chatId,
      'Отправте вашу почту которую вы указывали в оплате'
    )
  }
}
