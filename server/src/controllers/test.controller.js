import { ResponseService } from '../services/response.service.js'
import { TgBot } from '../../../bot/bot.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { UserService } from '../services/user.service.js'
import { CloseReports } from '../cron/closeReports.cron.js'
export class TestController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
    this.UserService = new UserService()
    this.CloseReports = new CloseReports()
  }
  getTest = async (req, res) => {
    try {
      const Users = await this.UserService.getUsers()
      const message = 'Если у вас не работает ссылка для входа в канал. Напишите в личные сообщения к @Sqnder\nhttps://t.me/Sqnder'
      for(const user of Users) {
        if(user.chatId===5859777969){
          continue
        }
        this.ChannelService.sendMessageToUser(user.chatId,message)
      }
      this.ResponseService.success(res, 'success')
    } catch (error) {
      console.log('get test error', error)
      this.ResponseService.error(res, 'invalid token')
    }
  }
}
