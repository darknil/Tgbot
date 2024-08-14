import 'dotenv/config'
import { ResponseService } from '../services/response.service.js'
import { UserService } from '../services/user.service.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { TgBot } from '../../../bot/bot.js'
import { errorLogger, dataLogger } from '../logger/logger.js'
export class GetcourseWebhookController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.UserService = new UserService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
  }
  handleWebHook = async (req, res) => {
    try {
      console.log('getcourse webhook', req.query)
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
        const newUser = await this.UserService.createUser(
          '',
          '',
          '',
          '',
          '',
          email
        )
        const updatedUser =
          await this.UserService.updateUserSubscriptionDateByEmail(
            newUser.email,
            type
          )
        console.log('updated :', updatedUser)
        return this.ResponseService.success(res, 'ok')
      }

      await this.UserService.updateUserStatus(existedUser, 'member')
      await this.UserService.updateUserSubscriptionDate(
        existedUser.chatId,
        type
      )
      await this.UserService.updateUserField(
        existedUser.chatId,
        'wasNotified',
        false
      )
      this.ChannelService.unkickUser(existedUser.chatId)
      this.ChannelService.unbanUser(existedUser.chatId)
      const link = await this.ChannelService.createInviteLink()
      await this.MessageService.SendMessageToUser(
        existedUser.chatId,
        `Ваш платеж был успешно получен. Теперь вы можете присоединиться к каналу и начать использовать бота. ${link.invite_link}`
      )
      return this.ResponseService.success(res, 'ok')
    } catch (error) {
      errorLogger.error('handle webhook error :', error)
      console.log('getcourse webhook error :', error)
      return this.ResponseService.error(res, 'internal server error')
    }
  }
}
