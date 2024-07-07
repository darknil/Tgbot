export class MessageService {
  constructor(bot) {
    this.bot = bot
  }
  async SendMessageToUser(chatId, message) {
    try {
      this.bot.sendMessage(chatId, message)
      console.log(`message sent to user : ${chatId}`)
    } catch (error) {
      console.log('send message to user error :', error)
    }
  }
}
