import TelegramBot from 'node-telegram-bot-api'
import { commands } from './src/config/commands.config.js'
import { CommandHandler } from './src/handlers/command.handler.js'
import { MessageHandler } from './src/handlers/message.handler.js'
export class TgBot {
  constructor(token) {
    this.token = token
    this.initialize()
    this.registerCommads()
    this.CommandHandler = new CommandHandler(this.bot)
    this.MessageHandler = new MessageHandler(this.bot)
  }
  initialize() {
    try {
      this.bot = new TelegramBot(this.token, { polling: true })
      console.log('===============================================')
      console.log('telegram bot started')

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
