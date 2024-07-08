import crypto from 'crypto'

/**
 * Функция для генерации строки проверки данных.
 * @param {Object} data - Данные для проверки в формате ключ-значение.
 * @returns {string} Строка проверки данных.
 */
export function generateDataCheckString(data) {
  // Получаем отсортированные ключи объекта данных
  const keys = Object.keys(data).sort()

  // Формируем строку проверки данных в формате key=value с разделителем \n
  const dataCheckString = keys.map((key) => `${key}=${data[key]}`).join('\n')

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
