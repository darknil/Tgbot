import { DaysService } from '../services/days.service.js'
import { ResponseService } from '../services/response.service.js'
export class DaysController {
  constructor() {
    this.DaysService = new DaysService()
    this.ResponseService = new ResponseService()
  }
  getDaysQuantity = async (req, res) => {
    try {
      const daysCount = await this.DaysService.DaysQuantity()
      console.log('daysCount :', daysCount)
      this.ResponseService.success(res, daysCount)
    } catch (error) {
      console.log('getDaysCount error', error)
      this.ResponseService.error(res)
    }
  }
  getCurrentDay = async (req, res) => {
    try {
      console.log('this :', this)
      const currentDay = await this.DaysService.CurrentDay()
      this.ResponseService.success(res, currentDay)
    } catch (error) {
      console.log('get current day error :', error)
      this.ResponseService.error(res)
    }
  }
}
