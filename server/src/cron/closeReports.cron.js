import { ReportService } from '../services/report.service.js'
import { UserService } from '../services/user.service.js'
import { TgBot } from '../../../bot/bot.js'
export class CloseReports {
  constructor() {
    this.ReportService = new ReportService()
    this.UserService = new UserService()
    const botInstance = TgBot.getBotInstance()
  }
  async closeReports() {
    try {
      /// вызвать метод для изменения статуса отчётов за прошлые сутки
      const updated = await this.ReportService.closeReportsForPreviousDay() // получить измененёные отчёты
      if (!updated) {
        throw new Error('reports was not updated')
      }
      // Отфильтровать всех пользователей по массиву с отчётами.
      // Получить пользователей у которых был отчёт за сутки
      // Отфильтровать пользователей у которых был отчёт от тех у кого не было
      // Вызвать метод кика пользователей для тех кто без отчёта
      // поменять статус пользователям isBanned = true
    } catch (error) {
      console.log('close reports error :', error)
    }
  }
}
