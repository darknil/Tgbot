import { keyboards } from '../config/keyboards.config.js'

export class CommandHandler {
  constructor(bot) {
    this.bot = bot
    this.bot.onText(/\/start/, this.handleUserStart.bind(this))
  }
  async handleUserStart(msg) {
    try {
      const chatId = msg.chat.id
      this.bot.sendMessage(chatId, 'Hello, welcome to the bot!', keyboards)
    } catch (error) {
      console.log('handle user start error', error)
    }
  }
}
