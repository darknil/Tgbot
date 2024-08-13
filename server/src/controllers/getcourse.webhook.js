import 'dotenv/config'
import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { TgBot } from '../../../bot/bot.js'
export class GetcourseWebhookController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.UserService = new UserService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
  }
  handleWebHook = async (req, res) => {
    console.log('getcourse webhook', req.query)
    console.log('getcourse webhook data :', req.body)
    const email = req.query.email
    const key = req.query.key
    const type = req.query.type
    if (key !== process.env.secret_key) {
      return this.ResponseService.notFound(res, 'bad request')
    }
    if (!email || !type) {
      return this.ResponseService.badRequest(res, 'Bad request')
    }

    const existedUser = await this.UserService.getUserByEmail(email)
    if (!existedUser) {
      await this.UserService.createUser('', '', '', '', '', email)
      return this.ResponseService.success(res, 'ok')
    }

    await this.UserService.updateUserStatus(existedUser, 'member')
    await this.UserService.updateUserSubscriptionDate(existedUser.chatId, type)
    this.ChannelService.unkickUser(existedUser.chatId)
    this.ChannelService.unbanUser(existedUser.chatId)
    const link = await this.ChannelService.createInviteLink()
    await this.MessageService.SendMessageToUser(
      existedUser.chatId,
      `Ваш платеж был успешно получен. Теперь вы можете присоединиться к каналу и начать использовать бота. ${link.invite_link}`
    )
    return this.ResponseService.success(res, 'ok')
  }
}
