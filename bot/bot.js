import TelegramBot from 'node-telegram-bot-api'
import { commands } from './src/config/commands.config'
export class TgBot {
  constructor(token) {
    this.token = token
    this.initialize()
    this.registerCommads()
  }
  initialize() {
    try {
      this.bot = new TelegramBot(this.token, { polling: true })
      console.log('telegramBot ---- OK')
      this.registerCommads()
    } catch (error) {
      console.error('Error initializing bot:', error)
    }
  }
  registerCommads() {
    try {
      this.bot.setMyCommands(commands)
    } catch (error) {
      console.error('Error register bot commands:', error)
    }
  }
}
