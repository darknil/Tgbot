import { ReportDTO } from '../dtos/report.dto.js'
import { DtoValidator } from '../utils/dtoValidator.js'
import { ReportService } from '../services/report.service.js'
import { ResponseService } from '../services/response.service.js'
import { JwtService } from '../services/jwt.service.js'
import { UserService } from '../services/user.service.js'
export class ReportController {
  constructor() {
    this.ReportService = new ReportService()
    this.ResponseService = new ResponseService()
    this.JwtService = new JwtService()
    this.UserService = new UserService()
  }
  getAll = async (req, res) => {
    try {
      // const token = req.headers.authorization
      // if (!token) {
      //   return this.ResponseService.unauthorized(res, 'No token provided')
      // }
      // const decoded = this.JwtService.verifyToken(token.replace('Bearer ', ''))

      // if (!decoded) {
      //   return this.ResponseService.unauthorized(res, 'Invalid token')
      // }
      const reports = await this.ReportService.getReports()
      if (!reports) {
        return this.ResponseService.notFound(res, 'Reports not found')
      }
      return this.ResponseService.success(res, reports)
    } catch (error) {
      console.log('get all reports error', error)
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
      const { questions } = req.body
      if (!questions) {
        return this.ResponseService.badRequest(res, 'Missing questions fields')
      }
      console.log(decoded)
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
        return this.ResponseService.badRequest(res, 'report already exists ')
      }
      const report = await this.ReportService.create(user, questions)
      if (!report) {
        return this.ResponseService.badRequest(res, 'Error creating report')
      }
      return this.ResponseService.success(res, report)
    } catch (error) {
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
      console.log('decoded chatId :', decoded.user.chatId)
      const report = await this.ReportService.getUserReport(decoded.user.chatId)
      if (!report) {
        return this.ResponseService.notFound(res, 'Report not found')
      }
      return this.ResponseService.success(res, report)
    } catch (error) {
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
      console.log('get user reports error', error)
      return this.ResponseService.error(res, 'Error getting reports')
    }
  }
}
