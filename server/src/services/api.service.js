import { api, apiSchema } from '../models/apiKey.model.js'
import { v4 as uuidv4 } from 'uuid'
export class ApiService {
  async generate() {
    try {
      const key = uuidv4()
      const newApiKey = new api({ id: Date.now(), key })
      await newApiKey.save()
      return { key }
    } catch (error) {
      console.log('generate api key error :', error)
    }
  }
  async verify(key) {
    try {
      const apiKey = await api.findOne({ key })
      if (!apiKey) {
        return { valid: false, message: 'Invalid API key' }
      }
      return { valid: true, message: 'Access granted' }
    } catch (error) {
      console.log('verify api key error :', error)
    }
  }
}
