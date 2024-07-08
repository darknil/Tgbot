import { ReportService } from '../services/report.service.js'
import { ResponseService } from '../services/response.service.js'
import { TgBot } from '../../../bot/bot.js'
import { UnbanUserFromChannel } from '../../../bot/src/services/unbanUserFromChannel.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { InvoiceDTO } from '../dtos/invoice.dto.js'
import { ApiService } from '../services/api.service.js'
import { validate } from '@telegram-apps/init-data-node'
export class TestController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
  }
  getTest = async (req, res) => {
    try {
      const initdata = req.headers.authorization
      const secretToken = process.env.TG_TOKEN
      const validateData = validate(initdata, secretToken)
      console.log('initdata :', initdata)
      console.log('validateData :', validateData)
      this.ResponseService.success(res, 'success')
    } catch (error) {
      console.log('get test error', error)
    }
  }
}
