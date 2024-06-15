export class MessageHandler {
  constructor(bot) {
    this.bot = bot
  }
  handleUserMessage(msg) {
    console.log('Message from user:', msg)
  }
}
