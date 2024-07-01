import crypto from 'crypto'
import 'dotenv/config'

const botToken = process.env.TG_TOKEN

const createDataCheckString = (data) => {
  const { hash, ...dataWithoutHash } = data
  const sortedKeys = Object.keys(dataWithoutHash).sort()
  const dataCheckArray = sortedKeys.map((key) => {
    if (typeof dataWithoutHash[key] === 'object') {
      return `${key}=${JSON.stringify(dataWithoutHash[key])}`
    }
    return `${key}=${dataWithoutHash[key]}`
  })
  return dataCheckArray.join('\n')
}

const generateSecretKey = (botToken) => {
  return crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
}

const calculateHash = (dataCheckString, secretKey) => {
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  console.log('Generated hash:', hash) // Output the generated hash to the console

  return hash
}

const verifyData = async (data, botToken) => {
  const { hash, ...dataWithoutHash } = data

  // Create the data check string
  const dataCheckString = createDataCheckString(dataWithoutHash)

  // Generate the secret key
  const secretKey = generateSecretKey(botToken)

  // Calculate the hash
  const calculatedHash = calculateHash(dataCheckString, secretKey)

  // Verify the hash
  return calculatedHash === data.hash
}

const isAuthDateValid = async (authDate, maxAgeSeconds = 300) => {
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime - authDate <= maxAgeSeconds
}

const validateUserData = async (userData, botToken) => {
  // Verify the hash
  if (!(await verifyData(userData, botToken))) {
    return false
  }

  // Check the auth_date to ensure the data is not outdated
  if (!(await isAuthDateValid(Number(userData.auth_date)))) {
    return false
  }

  return true
}

export default async (data) => {
  if (await validateUserData(data, botToken)) {
    return true
  } else {
    console.log('Data validation failed with data', data)
    return false
  }
}
