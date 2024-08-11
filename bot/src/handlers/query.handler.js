export class QueryHandler {
  constructor(bot) {
    this.bot = bot
    bot.on('callback_query', this.handleQuery.bind(this))
  }
  async handleQuery(query) {
    try {
      console.log('query', query)
      const data = query.data
      const chatId = query.chat.id
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
    await this.bot.sendMessage(
      chatId,
      'Отправте вашу почту которую вы указывали в оплате'
    )
  }
}
