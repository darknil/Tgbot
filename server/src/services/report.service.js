import { Report } from '../models/report.model.js'
import { getPreviousDayRange } from '../utils/dateUtils.js'
import { startDay, endDay } from '../config/Days.config.js'
export class ReportService {
  create = async (user, questions) => {
    try {
      if (!user) {
        throw new Error('User is required')
      }
      if (!questions || questions.length < 3) {
        throw new Error('Three questions are required')
      }

      const formattedQuestions = questions.map((answer, index) => {
        const bodies = [
          'Что было сделано сегодня?',
          'Что я буду делать завтра?',
          'Что я могу улучшить?'
        ]
        return {
          id: index,
          body: bodies[index],
          answer: answer
        }
      })

      const lastReport = await Report.findOne().sort({ id: -1 }).exec()
      const newId = lastReport ? lastReport.id + 1 : 0

      const newReport = new Report({
        id: newId,
        ownerChatId: user.chatId,
        ownerUsername: user.username,
        userId: user.id,
        ownerUuid: user._id.toHexString(),
        questions: formattedQuestions,
        date: new Date(),
        isClosed: false
      })

      const savedReport = await newReport.save()
      return savedReport
    } catch (error) {
      console.error('Create user report error:', error)
      return false
    }
  }
  async updateReportField(id, field, value) {
    try {
      const result = await Report.updateOne(
        {
          id: id
        },
        {
          $set: {
            [field]: value
          }
        }
      )
      return result
    } catch (error) {
      console.log('update user field error', error)
    }
  }
  async getReportsByDay(dayIndex) {
    try {
      if (dayIndex === undefined || dayIndex === null) {
        return new Error('Day index is required')
      }
      dayIndex = parseInt(dayIndex)

      const startDateObject = startDay
      const targetDate = new Date(startDateObject)
      targetDate.setDate(startDateObject.getDate() + dayIndex)
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
      return true
    } catch (error) {
      console.error('Error closing reports for the previous day:', error)
      throw error
    }
  }
  async getClosedReports() {
    try {
      const closedReports = await Report.find({ isClosed: true })
      return closedReports
    } catch (error) {
      console.log('get closed reports error :', error)
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
      const userReport = await Report.findOne({
        ownerChatId: chatId,
        date: { $gte: startOfDay, $lt: endOfDay }
      })
      if (!userReport) {
        return null
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
  async getReportsByLastDay() {
    try {
      const { startOfDay, endOfDay } = getPreviousDayRange()
      const reports = await Report.find({
        date: { $gte: startOfPreviousDay, $lt: endOfPreviousDay }
      })
      if (!reports) {
        return false
      }
      return reports
    } catch (error) {
      console.log('get last day reports error', error)
      return false
    }
  }
  async getReportById(id) {
    try {
      const report = await Report.find({ id: id })
      if (!report) {
        return false
      }
      return report
    } catch (error) {
      console.log('get report by id error', error)
    }
  }
  async deleteReport(id) {
    try {
      const result = await Report.deleteOne({ id: id })
      if (!result) {
        return false
      }
      return result
    } catch (error) {
      console.log('delete report error', error)
    }
  }
}
