import axios from 'axios'
import 'dotenv/config'
import { logger } from '../logger/logger.js'
export class ApiService {
  constructor() {
    this.apiUrl = process.env.LAVA_TOP_URL
    this.apiKey = process.env.LAVA_TOP_API_KEY
  }
  async requestInvoice(transactionData) {
    try {
      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
      const response = await axios.post(
        `${this.apiUrl}/api/v2/invoice`,
        transactionData,
        { headers }
      )
      console.log('RequestInvoice response:', response.data)
      return response.data
    } catch (error) {
      console.log('RequestInvoice error writed to logger')
      logger.error(error.message)
      return false
    }
  }
}
