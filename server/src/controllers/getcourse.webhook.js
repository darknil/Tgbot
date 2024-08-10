import { ResponseService } from '../services/response.service.js'
export class GetcourseWebhookController {
  constructor() {
    this.ResponseService = new ResponseService()
  }
  handleWebHook = async (req, res) => {
    console.log('getcourse webhook', req.query)
    console.log('getcourse webhook data :', req.body)
    this.ResponseService.success(res, 'ok')
  }
}
