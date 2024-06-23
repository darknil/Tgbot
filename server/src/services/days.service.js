import { startDay, endDay } from '../config/Days.config.js'
export class DaysService {
  async DaysQuantity() {
    try {
      const daysCount =
        (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
      return daysCount
    } catch (error) {
      console.log('getDaysCount error', error)
    }
  }
  async CurrentDay() {
    try {
      const today = new Date()
      console.log('start day :', startDay)
      console.log('today :', today)
      const currentDay =
        Math.floor(
          (today.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      console.log('curent day :', currentDay)
      return currentDay
    } catch (error) {
      console.log('get current day error :', error)
    }
  }
}
