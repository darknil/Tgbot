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
      for(const user of Users) {
        if(user.chatId === 5859777969) {
          continue
        }
        const isMember = await this.ChannelService.isMember(user.chatId)
        if(isMember.status === 'left' || isMember.status === 'kicked') {
          const inviteLink = await this.ChannelService.createInviteLink(user.chatId)
          this.ChannelService.sendMessageToUser(user.chatId, inviteLink)
          const username = user.username? user.username : 'no username'
          console.log('message sent to user',user.firstName, username)
        }
      }
      this.ResponseService.success(res, 'success')
    } catch (error) {
      console.log('get test error', error)
      this.ResponseService.error(res, 'invalid token')
    }
  }
  Test = async (req, res) => {
    try {
      this.CloseReports.closeReports()
      this.ResponseService.success(res, 'success')
    } catch (error) {
      console.log('get test error', error)
      this.ResponseService.error(res, 'invalid token')
    }
  }
}
