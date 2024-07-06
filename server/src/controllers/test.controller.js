import { ReportService } from '../services/report.service.js'
import { ResponseService } from '../services/response.service.js'
import { TgBot } from '../../../bot/bot.js'
import { UnbanUserFromChannel } from '../../../bot/src/services/unbanUserFromChannel.js'
import { InvoiceDTO } from '../dtos/invoice.dto.js'
import { ApiService } from '../services/api.service.js'
export class TestController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.UnbanUserFromChannel = new UnbanUserFromChannel(botInstance)
    this.ResponseService = new ResponseService()
    this.ReportService = new ReportService()
    this.ApiService = new ApiService()
  }
  getTest = async (req, res) => {
    try {
      const email = 'test@test.test'

      const invoiceDTO = new InvoiceDTO(email)
      const invoice = await this.ApiService.requestInvoice(invoiceDTO)
      this.ResponseService.success(res, invoice)
    } catch (error) {
      console.log('get test error', error)
    }
  }
}
