import { ResponseService } from '../services/response.service.js'
import { TgBot } from '../../../bot/bot.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { MessageService } from '../../../bot/src/services/message.service.js'
import { UserService } from '../services/user.service.js'
import { CloseReports } from '../cron/closeReports.cron.js'
import { StatusService } from '../services/status.service.js'
import { ReportService } from '../services/report.service.js'
import { errorLogger,dataLogger } from '../logger/logger.js'
export class TestController {
  constructor() {
    const botInstance = TgBot.getBotInstance()
    this.ResponseService = new ResponseService()
    this.ChannelService = new ChannelService(botInstance)
    this.MessageService = new MessageService(botInstance)
    this.UserService = new UserService()
    this.StatusService = new StatusService()
    this.ReportService = new ReportService()
    this.CloseReports = new CloseReports()
  }
  getTest = async (req, res) => {
    try {
      const users = await this.UserService.getUsers()
      const updatedUsers = [];
      for (let user of users) {
        if (user.status) {
          try {
            const status = await this.StatusService.getStatusByUuid(user.status);
            const hasReport = await this.ReportService.getUserReport(user.chatId);
            const hasUserReport = !!hasReport
            let newUser = {
              id:user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              chatId: user.chatId,
              status: status.value,
              hasReport: hasUserReport
            }
            updatedUsers.push(newUser);
          } catch (error) {
            errorLogger.error(`Ошибка при обновлении статуса для пользователя ${user.username}:`, error);
            console.error(`Ошибка при обновлении статуса для пользователя ${user.username}:`, error);
          }
        }
      }
      return this.ResponseService.success(res, updatedUsers);
    } catch (error) {
      console.log('get test error :', error)
      errorLogger.error('get test error:', error);
      return this.ResponseService.error(res, )
    }
  }
  Test = async (req, res) => {
    try {
      this.CloseReports.closeReports(1)
      this.ResponseService.success(res, 'success')
    } catch (error) {
      console.log('get test error', error)
      errorLogger.error('get test error:', error);
      return this.ResponseService.error(res, 'invalid token')
    }
  }
}
