export class MessageHandler {
  constructor(bot) {
    this.bot = bot
    this.bot.on('message', (msg) => {
      this.handleUserMessage(msg)
    })
  }
  handleUserMessage(msg) {
    try {
      const chatId = msg.chat.id
      this.bot.sendMessage(chatId, 'Hello World!')
    } catch (error) {
      console.log('Error handling user message:', error)
    }
    console.log('Message from user:', msg)
  }
}
