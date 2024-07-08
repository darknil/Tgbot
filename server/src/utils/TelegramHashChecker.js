import {
  generateSecretKey,
  generateDataCheckString,
  generateSignature
} from './helpers.js'

class TelegramHashChecker {
  constructor(botToken) {
    this.botToken = botToken
    this.secretKey = generateSecretKey(botToken)
  }

  verifyHash(data) {
    const receivedHash = data.hash
    console.log('received hash :', receivedHash)
    const dataCheckString = generateDataCheckString(data)
    const signature = generateSignature(dataCheckString, this.secretKey)
    console.log('signature :', signature)
    return signature === receivedHash
  }

  checkAuthDate(data, maxAgeSeconds) {
    const authDate = parseInt(data.auth_date, 10)
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime - authDate <= maxAgeSeconds
  }
}

export default TelegramHashChecker
