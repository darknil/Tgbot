import { ResponseService } from '../services/response.service.js'
import { TransactionService } from '../services/transaction.service.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { UnbanUserFromChannel } from '../../../bot/src/services/unbanUserFromChannel.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { UserService } from '../services/user.service.js'
import { TgBot } from '../../../bot/bot.js'
export class WebHookController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.TransactionService = new TransactionService()
    this.ChannelService = new ChannelService(botInstance)
    this.UnbanUserFromChannel = new UnbanUserFromChannel(botInstance)
    this.MessageService = new MessageService(botInstance)
    this.UserService = new UserService()
  }
  handleWebHook = async (req, res) => {
    try {
      const headers = req.headers
      const data = req.body

      console.log('webhook data :', data)
      const transaction = await this.TransactionService.getTransaction(
        data.contractId
      )
      if (!transaction) {
        console.log('transaction not found with contractId :', data.contractId)
        return this.ResponseService.notFound(res, 'transaction not found')
      }
      await this.TransactionService.updateTransactionFieldByContracId(
        data.contractId,
        'amount',
        data.amount
      )
      await this.TransactionService.updateTransactionFieldByContracId(
        data.contractId,
        'status',
        data.status
      )
      await this.TransactionService.updateTransactionFieldByContracId(
        data.contractId,
        'timestamp',
        data.timestamp
      )
      const updated =
        await this.TransactionService.updateTransactionFieldByContracId(
          data.contractId,
          'isPaid',
          true
        )
      const user = await this.UserService.getUser(updated.userChatId)
      if (user.isBanned) {
        await this.UserService.updateUserField(user.chatId, 'isBanned', false)
        await this.UnbanUserFromChannel.unbanUser(user.chatId)
      }
      const link = await this.ChannelService.createInviteLink()
      console.log('link :', link)
      await this.MessageService.SendMessageToUser(
        user.chatId,
        `Ваш платеж был успешно получен. Теперь вы можете присоединиться к каналу и начать использовать бота. ${link.invite_link}`
      )
      return this.ResponseService.success(res, 'webhook received')
    } catch (error) {
      console.log('handle webhook error :', error)
    }
  }
}
