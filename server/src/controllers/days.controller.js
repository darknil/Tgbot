import { DaysService } from '../services/days.service.js'
import { ResponseService } from '../services/response.service.js'
import { errorLogger,dataLogger } from '../logger/logger.js'
export class DaysController {
  constructor() {
    this.DaysService = new DaysService()
    this.ResponseService = new ResponseService()
  }
  getDaysQuantity = async (req, res) => {
    try {
      const daysCount = await this.DaysService.DaysQuantity()
      this.ResponseService.success(res, daysCount)
    } catch (error) {
      errorLogger.error('getDaysCount error', error)
      console.log('getDaysCount error', error)
      this.ResponseService.error(res)
    }
  }
  getCurrentDay = async (req, res) => {
    try {
      const currentDay = await this.DaysService.CurrentDay()
      this.ResponseService.success(res, currentDay)
    } catch (error) {
      errorLogger.error('get current day error :', error)
      console.log('get current day error :', error)
      this.ResponseService.error(res)
    }
  }
}
