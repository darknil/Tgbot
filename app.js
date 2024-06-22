import 'dotenv/config'
import { TgBot } from './bot/bot.js'
import { ExpressServer } from './server/server.js'
class App {
  constructor() {
    this.port = process.env.PORT || 4000
    // this.initTelegramBot()
    this.initExpressServer()
  }
  initTelegramBot() {
    const token = process.env.TG_TOKEN
    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in the environment variables'
      )
    }
    this.tgBot = new TgBot(token)
  }
  initExpressServer() {
    this.expressServer = new ExpressServer(this.port)
  }
}
const app = new App()
