export class QueryHandler {
  constructor(bot) {
    this.bot = bot
    bot.on('callback_query', this.handleUserQuery.bind(this))
  }
  async handleUserQuery(query) {
    try {
      const chatId = query.message.chat.id
      const data = query.data
      console.log(`handle user ${chatId} with data :`, data)
    } catch (error) {
      console.log('handleUserQuery error', error)
    }
  }
}
