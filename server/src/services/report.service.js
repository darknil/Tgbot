import { Report } from '../models/report.model'
import { getPreviousDayRange } from '../utils/dateUtils'
export class ReportService {
  async createReport(ownerUuid, report, questions) {
    try {
      if (!ownerUuid) {
        return new Error('Owner UUID is required')
      }
      if (!report) {
        return new Error('Report is required')
      }
      if (!questions) {
        return new Error('Questions are required')
      }
      const newReport = new Report({
        id: report.id,
        ownerId: ownerUuid,
        questions: questions,
        date: new Date(),
        isClosed: false
      })
      const savedReport = await newReport.save()
      console.log('Report saved successfully:', savedReport)
      return savedReport
    } catch (error) {
      console.log('create user error', error)
    }
  }
  async updateReportField(id, field, value) {
    try {
    } catch (error) {
      console.log('update user field error', error)
    }
  }
  async getReportsByDay(date) {
    try {
      if (!date) {
        return new Error('Date is required')
      }
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
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
  async getReports(userUuid) {
    try {
      const report = await Report.findById({ id: id })
      if (!user) {
        return new Error('User not found')
      }
      return report
    } catch (error) {
      console.log('get user error', error)
    }
  }
  async getUserReportByday(userUuid) {
    try {
    } catch (error) {
      console.log('get user reports  error', error)
    }
  }
}
