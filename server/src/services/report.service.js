import { Report } from '../models/report.model.js'
import { getPreviousDayRange } from '../utils/dateUtils.js'
import { startDay, endDay } from '../config/Days.config.js'
export class ReportService {
  async getLastReport() {
    try {
      const lastReport = await Report.findOne().sort({ id: -1 }).exec()
      return lastReport
    } catch (error) {
      console.log('get last report error', error)
      return null
    }
  }
  async create(user, questions) {
    try {
      if (!user) {
        return new Error('user is required')
      }
      if (!questions) {
        return new Error('Questions are required')
      }
      const lastReport = await this.getLastReport()
      const newId = lastReport ? lastReport.id + 1 : 0
      const newReport = new Report({
        id: newId,
        ownerChatId: user.chatId,
        ownerUuid: user._id.toHexString(),
        questions: questions,
        date: new Date(),
        isClosed: false
      })
      const savedReport = await newReport.save()
      console.log('Report saved successfully:', savedReport)
      return savedReport
    } catch (error) {
      console.log('create user report error', error)
      return false
    }
  }
  async updateReportField(id, field, value) {
    try {
    } catch (error) {
      console.log('update user field error', error)
    }
  }
  async getReportsByDay(dayIndex) {
    try {
      if (dayIndex === undefined || dayIndex === null) {
        return new Error('Day index is required')
      }
      const zeroDay = startDay // Предположим, что "нулевой день" установлен на 1 июня 2024 года
      zeroDay.setHours(0, 0, 0, 0) // Устанавливаем время на начало дня

      const targetDate = new Date(zeroDay)
      targetDate.setDate(zeroDay.getDate() + dayIndex) // Добавляем дни к "нулевому дню"

      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      const reports = await Report.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })

      return reports
    } catch (error) {
      console.error('Error fetching reports by day:', error)
      throw error
    }
  }

  async closeReportsForPreviousDay() {
    try {
      const { startOfDay, endOfDay } = getPreviousDayRange()

      const result = await Report.updateMany(
        {
          date: {
            $gte: startOfDay,
            $lte: endOfDay
          },
          isClosed: false // Обновлять только если isClosed: false
        },
        {
          $set: { isClosed: true }
        }
      )

      console.log(`Reports closed for the previous day: ${result.nModified}`)
    } catch (error) {
      console.error('Error closing reports for the previous day:', error)
      throw error
    }
  }
  async getReports() {
    try {
      const reports = await Report.find()
      return reports
    } catch (error) {
      console.log('get user error', error)
    }
  }
  async getUserReport(chatId) {
    try {
      const { startOfDay, endOfDay } = getPreviousDayRange()
      console.log('startOfDay', startOfDay)
      console.log('endOfDay', endOfDay)
      const userReport = await Report.findOne({
        ownerChatId: chatId,
        date: { $gte: startOfDay, $lt: endOfDay }
      })
      console.log('userReport', userReport)
      if (!userReport) {
        return false
      }
      return userReport
    } catch (error) {
      console.log('get user report  error', error)
    }
  }
  async getUserReports(chatId) {
    try {
      const { startOfDay, endOfDay } = getPreviousDayRange()
      const userReports = await Report.find({
        ownerChatId: chatId
      })
      if (!userReports) {
        return false
      }
      return userReports
    } catch (error) {
      console.log('get user reports error', error)
    }
  }
}
