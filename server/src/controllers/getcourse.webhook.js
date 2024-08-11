import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
export class GetcourseWebhookController {
  constructor() {
    this.ResponseService = new ResponseService()
    this.UserService = new UserService()
  }
  handleWebHook = async (req, res) => {
    console.log('getcourse webhook', req.query)
    console.log('getcourse webhook data :', req.body)
    const email = req.query.email
    const status = req.query.status
    if (!email || !status) {
      return this.ResponseService.badRequest(res, 'Bad request')
    }
    const existedUser = await this.UserService.getUserByEmail(email)
    if (!existedUser) {
      await this.UserService.createUser('', '', '', '', '', email)
      return this.ResponseService.success(res, 'ok')
    }
    if (status === 'Завершен') {
      await this.UserService.updateUserStatus(existedUser, 'member')
      return this.ResponseService.success(res, 'ok')
    }

    return this.ResponseService.success(res, 'ok')
  }
}
