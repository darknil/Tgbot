import { ReportDTO } from '../dtos/report.dto.js'
import { DtoValidator } from '../utils/dtoValidator.js'
import { ReportService } from '../services/report.service.js'
import { ResponseService } from '../services/response.service.js'
import { JwtService } from '../services/jwt.service.js'
import { UserService } from '../services/user.service.js'
import upload from '../config/multer.config.js'
import { errorLogger, dataLogger } from '../logger/logger.js'
export class ReportController {
  constructor() {
    this.ReportService = new ReportService()
    this.ResponseService = new ResponseService()
    this.JwtService = new JwtService()
    this.UserService = new UserService()
  }
  fetchReports = async (req, res) => {
    try {
      // const token = req.headers.authorization
      // if (!token) {
      //   return this.ResponseService.unauthorized(res, 'No token provided')
      // }
      // const decoded = this.JwtService.verifyToken(token)

      // if (!decoded) {
      //   return this.ResponseService.unauthorized(res, 'Invalid token')
      // }
      const page = parseInt(req.query.page) || 0
      const limit = 20
      const reports = await this.ReportService.getReports(page, limit)
      if (!reports) {
        return this.ResponseService.notFound(res, 'Reports not found')
      }
      const hasMore = await this.ReportService.hasMoreReports(page, limit)
      return this.ResponseService.success(res, {
        hasMoreReports: hasMore,
        reports
      })
    } catch (error) {
      console.log('get all reports error', error)
      errorLogger.error('get all reports error', error)
      return this.ResponseService.error(res, 'Error getting reports')
    }
  }
  getReportsbyDay = async (req, res) => {
    try {
      // const token = req.headers.authorization
      // if (!token) {
      //   return this.ResponseService.unauthorized(res, 'No token provided')
      // }
      // const decoded = this.JwtService.verifyToken(token.replace('Bearer ', ''))

      // if (!decoded) {
      //   return this.ResponseService.unauthorized(res, 'Invalid token')
      // }
      const day = req.params.day
      if (!day) {
        return this.ResponseService.badRequest(res, 'Missing day number')
      }
      const reports = await this.ReportService.getReportsByDay(day)
      if (!reports) {
        return this.ResponseService.notFound(res, 'Reports not found')
      }
      return this.ResponseService.success(res, reports)
    } catch (error) {
      errorLogger.error('get reports by day error', error)
      console.log('get reports by day error', error)
    }
  }

  postUserReport = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const { question1, question2, question3 } = req.body

      const questions = [question1, question2, question3]
      if (questions.includes(undefined)) {
        return this.ResponseService.badRequest(res, 'Missing questions fields')
      }
      const user = await this.UserService.getUser(decoded.user.chatId)
      if (!user) {
        return this.ResponseService.unauthorized(
          res,
          'User not found in database'
        )
      }
      const existedReport = await this.ReportService.getUserReport(
        decoded.user.chatId
      )
      if (existedReport) {
        await this.ReportService.deleteReport(existedReport.id)
      }
      const report = await this.ReportService.create(user, questions)
      if (!report) {
        return this.ResponseService.badRequest(res, 'Error creating report')
      }
      return this.ResponseService.success(res, report.id)
    } catch (error) {
      errorLogger.error('post user report error', error)
      console.log('post user report error', error)
      return this.ResponseService.error(res, 'Error creating report')
    }
  }
  getUserReportByDay = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)

      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const report = await this.ReportService.getUserReport(decoded.user.chatId)
      if (!report) {
        return this.ResponseService.notFound(res, 'Report not found')
      }
      return this.ResponseService.success(res, report)
    } catch (error) {
      errorLogger.error('get user report by day error', error)
      console.log('get user report by day error', error)
      return this.ResponseService.error(res, 'Error getting report')
    }
  }
  getUserReports = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token.replace('Bearer ', ''))

      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const reports = await this.ReportService.getUserReports(
        decoded.user.chatId
      )
      if (!reports) {
        return this.ResponseService.notFound(res, 'Reports not found')
      }
      return this.ResponseService.success(res, reports)
    } catch (error) {
      errorLogger.error('get user reports error', error)
      console.log('get user reports error', error)
      return this.ResponseService.error(res, 'Error getting reports')
    }
  }
}
