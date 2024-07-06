import axios from 'axios'
import 'dotenv/config'
import { errorLogger, dataLogger } from '../logger/logger.js'
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

      // Log the response data using the dataLogger
      dataLogger.info('RequestInvoice response:', {
        responseData: response.data
      })

      return response.data
    } catch (error) {
      console.error('RequestInvoice error:', error.data)
      // Log the error using the errorLogger
      errorLogger.error(error.message, { stack: error.stack })
      dataLogger.error('RequestInvoice error:', {
        errorMessage: error.message,
        stack: error.stack
      })
      return this.Rs
    }
  }
}
