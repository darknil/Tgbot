import { ReportService } from '../services/report.service.js'
import { ResponseService } from '../services/response.service.js'
import { TgBot } from '../../../bot/bot.js'
import { UnbanUserFromChannel } from '../../../bot/src/services/unbanUserFromChannel.js'
export class TestController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.UnbanUserFromChannel = new UnbanUserFromChannel(botInstance)
    this.ResponseService = new ResponseService()
    this.ReportService = new ReportService()
  }
  getTest = async (req, res) => {
    try {
      // this.UnbanUserFromChannel.unbanUser(628175854)
      // this.ResponseService.success(res, 'Unbanned user')
    } catch (error) {
      console.log('get test error', error)
    }
  }
}
