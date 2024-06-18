import TelegramBot from 'node-telegram-bot-api'
import { commands } from './src/config/commands.config.js'
import { CommandHandler } from './src/handlers/command.handler.js'
import { MessageHandler } from './src/handlers/message.handler.js'
import { QueryHandler } from './src/handlers/query.handler.js'
import { ChannelHandler } from './src/handlers/channelHandlers/channelHandler.js'
export class TgBot {
  static botInstance
  constructor(token) {
    if (!TgBot.botInstance) {
      this.token = token
      this.initialize()
      this.CommandHandler = new CommandHandler(this.bot)
      this.MessageHandler = new MessageHandler(this.bot)
      this.QueryHandler = new QueryHandler(this.bot)
      this.ChannelHandler = new ChannelHandler(this.bot)
      TgBot.botInstance = this.bot // Сохраняем экземпляр в статическое свойство
    }
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
  static getBotInstance() {
    return TgBot.botInstance
  }
}
