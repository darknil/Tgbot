import crypto from 'crypto'

export function generateSecretKey(botToken) {
  const secret = 'WebAppData'
  return crypto.createHmac('sha256', secret).update(botToken).digest()
}

export function generateDataCheckString(data) {
  const keys = Object.keys(data)
    .filter((key) => key !== 'hash')
    .sort()
  const dataCheckString = keys.map((key) => `${key}=${data[key]}`).join('\n')
  return dataCheckString
}

export function generateSignature(dataCheckString, secretKey) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')
}
