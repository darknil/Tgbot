import { ReportDTO } from '../dtos/report.dto.js'
import { DtoValidator } from '../utils/dtoValidator.js'
import { ReportService } from '../services/report.service.js'
export class ReportController {
  constructor() {
    this.ReportService = new ReportService()
  }
  async createReport(req, res) {
    try {
      const report = req.body
    } catch (error) {
      console.log('createReport error', error)
    }
  }
  async getAll(req, res) {
    try {
    } catch (error) {
      console.log('get all reports error', error)
    }
  }
  async getReportsbyDay(req, res) {
    try {
    } catch (error) {
      console.log('get reports by day error', error)
    }
  }
}
