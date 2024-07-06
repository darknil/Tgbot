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
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey // Добавляем X-Api-Key с вашим ключом
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
      console.error('RequestInvoice error:')
      // Log the error using the errorLogger
      errorLogger.error(error.message, { stack: error.stack })
      // Check if the error has a response and log its data
      if (error.response) {
        dataLogger.error('RequestInvoice error response data:', {
          responseData: error
        })
      }
      return this.Rs
    }
  }
}
