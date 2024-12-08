import { Status } from '../models/status.model.js'
import { errorLogger,dataLogger } from '../logger/logger.js'
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
      errorLogger.error('create status error', error)
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
      errorLogger.error('get status error', error)
      console.log('get status error', error)
    }
  }
  async getStatusByUuid(uuid) {
    try {
      const status = await Status.findOne({ _id: uuid })
      if (!status) {
        return false
      }
      return status
    } catch (error) {
      errorLogger.error('get status by uuid error', error)
      console.log('get status by uuid error', error)
    }
  }
}
