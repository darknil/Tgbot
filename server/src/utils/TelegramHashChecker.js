import crypto from 'crypto'

/**
 * Функция для генерации строки проверки данных.
 * @param {Object} data - Данные для проверки в формате ключ-значение.
 * @returns {string} Строка проверки данных.
 */
export function generateDataCheckString(data) {
  // Используем Object.entries(data), чтобы получить массив [key, value] для каждой пары в объекте data
  const entries = Object.entries(data)

  // Сортируем массив [key, value] по ключам (элемент [0] в массиве)
  entries.sort((a, b) => a[0].localeCompare(b[0]))

  // Формируем строку проверки данных в формате key=value с разделителем \n
  const dataCheckString = entries
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  console.log('Data check string:', dataCheckString)
  return dataCheckString
}

/**
 * Функция для генерации секретного ключа на основе токена бота.
 * @param {string} botToken - Токен бота.
 * @returns {string} Секретный ключ в формате HEX.
 */
export function generateSecretKey(botToken) {
  const secret = 'WebAppData'
  return crypto.createHmac('sha256', secret).update(botToken).digest('hex')
}

/**
 * Функция для генерации подписи HMAC-SHA-256 строки проверки данных.
 * @param {string} dataCheckString - Строка проверки данных.
 * @param {string} secretKey - Секретный ключ.
 * @returns {string} Подпись в формате HEX.
 */
export function generateSignature(dataCheckString, secretKey) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')
}

/**
 * Функция для проверки целостности данных на основе полученного хэша.
 * @param {Object} data - Данные, полученные от Telegram Mini App.
 * @param {string} botToken - Токен бота.
 * @returns {boolean} Результат проверки (true - данные подлинные, false - данные могли быть изменены).
 */
export function validateTelegramData(data, botToken) {
  const receivedHash = data.hash
  console.log('receivedHash :', receivedHash)
  const dataCheckString = generateDataCheckString(data)
  const secretKey = generateSecretKey(botToken)
  const calculatedHash = generateSignature(dataCheckString, secretKey)
  console.log('calculatedHash :', calculatedHash)
  return receivedHash === calculatedHash
}
