import 'dotenv/config'
import { TgBot } from './bot/bot.js'
import { ExpressServer } from './server/server.js'
import { importUsersFromCSV } from './server/src/utils/importData.js'
class App {
  constructor() {
    this.initTelegramBot()
    this.initExpressServer()
    if (process.env.IMPORT_DATA_FLAG === 'true') {
      this.initDataImport()
    }
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
  initDataImport() {
    importUsersFromCSV('users')
      .then(() => {
        process.exit(0)
      })
      .catch((err) => {
        console.error('Error importing data:', err)
        process.exit(1)
      })
  }
}
const app = new App()
