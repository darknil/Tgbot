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
      const report = await this.ReportService.getReportById(0)
      if (!report) {
        return this.ResponseService.notFound(res, 'Report not found')
      }
      console.log('report :', report)
      const updated = await this.ReportService.updateReportField(
        0,
        'photoUrl',
        'test'
      )
      console.log('updated :', updated)
      this.ResponseService.success(res, updated)
    } catch (error) {
      console.log('get test error', error)
    }
  }
}
