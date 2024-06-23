import 'dotenv/config'
import { TgBot } from './bot/bot.js'
import { ExpressServer } from './server/server.js'
class App {
  constructor() {
    this.initTelegramBot()
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
    const port = process.env.PORT || 3000
    this.expressServer = new ExpressServer(port)
  }
}
const app = new App()
