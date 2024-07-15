import { ResponseService } from '../services/response.service.js'
import { TgBot } from '../../../bot/bot.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { CloseReports } from '../cron/closeReports.cron.js'
export class TestController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
    this.CloseReports = new CloseReports()
  }
  getTest = async (req, res) => {
    try {
      
      this.ResponseService.success(res, 'success')
    } catch (error) {
      console.log('get test error', error)
      this.ResponseService.error(res, 'invalid token')
    }
  }
}
