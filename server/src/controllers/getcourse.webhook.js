import 'dotenv/config'
import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { TgBot } from '../../../bot/bot.js'
export class GetcourseWebhookController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.UserService = new UserService()
    this.MessageService = new MessageService(botInstance)
  }
  handleWebHook = async (req, res) => {
    console.log('getcourse webhook', req.query)
    console.log('getcourse webhook data :', req.body)
    const email = req.query.email
    const status = req.query.status
    const key = req.query.key
    if (key !== process.env.secret_key) {
      return this.ResponseService.notFound(res, 'bad request')
    }
    if (!email || !status) {
      return this.ResponseService.badRequest(res, 'Bad request')
    }
    const existedUser = await this.UserService.getUserByEmail(email)
    if (!existedUser) {
      await this.UserService.createUser('', '', '', '', '', email)
      return this.ResponseService.success(res, 'ok')
    }

    await this.UserService.updateUserStatus(existedUser, 'member')
    return this.ResponseService.success(res, 'ok')
  }
}
