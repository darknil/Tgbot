import { ReportService } from '../services/report.service.js'
import { ChannelService } from '../../../bot/src/services/channel.service.js'
import { UserService } from '../services/user.service.js'
import { TgBot } from '../../../bot/bot.js'
import { StatusService } from '../services/status.service.js'
import { errorLogger,dataLogger } from '../logger/logger.js'
export class CloseReports {
  constructor() {
    this.ReportService = new ReportService()
    this.UserService = new UserService()
    const botInstance = TgBot.getBotInstance()
    this.ChannelService = new ChannelService(botInstance)
    this.StatusService = new StatusService()
  }
  async closeReports(daysBack) {
    try {
      /// вызвать метод для изменения статуса отчётов за прошлые сутки
      const updated = await this.ReportService.closeReportsForPreviousDay(daysBack) // закрыть отчёты
      if (!updated) {
        throw new Error('reports was not updated')
      }
      const closedReports = await this.ReportService.getClosedReports(daysBack)
      console.log('closed reports lenght', closedReports.length)
      const ownerChatIds = closedReports.map((report) => report.ownerChatId)
      console.log('owner chat ids', ownerChatIds)
      const allUsers = await this.UserService.getMembers()
      console.log('all users lenght', allUsers.length)
      const usersWithoutReports = allUsers.filter(
        (user) => !ownerChatIds.includes(user.chatId)
      )
      console.log('users without reports', usersWithoutReports)
      let channelMembersWithoutReport = []
      for (const user of usersWithoutReports) {
        const userStatus = await this.StatusService.getStatusByUuid(user.status)
        if(userStatus.value === 'member') {
          this.ChannelService.kickUser(user.chatId)
          this.ChannelService.banUser(user.chatId)
          this.UserService.updateUserStatus(user,'member')
          if(!user.username){
            channelMembersWithoutReport.push(user.firstName)
            continue
          }
          channelMembersWithoutReport.push(user.username)
        }

      }

      await this.ChannelService.sendMessageToAdmin(
        channelMembersWithoutReport,
        allUsers.length
      )
      // Отфильтровать всех пользователей по массиву с отчётами. = пользователи с отчётами
      // Получить пользователей у которых был отчёт за сутки = все пользователи
      // все пользователи - пользователи с отчётами = пользователи без отчёта
      // Вызвать метод кика пользователей для тех кто без отчёта
      // поменять статус пользователям isBanned = true
    } catch (error) {
      errorLogger.error('close reports error :', error)
      console.log('close reports error :', error)
    }
  }
}
