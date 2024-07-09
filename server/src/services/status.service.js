import { Status } from '../models/status.model.js'
export class StatusService {
  async createStatus(value) {
    try {
      const lastStatus = await Status.findOne().sort({ id: -1 }).limit(1)
      const id = lastStatus ? lastStatus.id + 1 : 0
      const valueList = ['guest','banned', 'member', 'freezed', 'admin']
      if (!valueList.includes(value)) {
        throw new Error('Invalid status value')
      }
      const newStatus = new Status({ id, value })
      const savedStatus = await newStatus.save()
      return savedStatus
    } catch (error) {
      console.log('create status error', error)
      return false
    }
  }
  async getStatus(value) {
    try {
      const status = await Status.findOne({ value })
      if (!status) {
        return false
      }
      return status
    } catch (error) {
      console.log('get status error', error)
    }
  }
}
