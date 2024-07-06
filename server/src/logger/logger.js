import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, printf } = format

// Формат для вывода логов
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${message} ${
    stack ? `\nStack: ${stack}` : ''
  }`
})

// Убедитесь, что директория 'logs' существует
const logDir = path.resolve('logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// Путь к файлу логов для ошибок
const errorLogFilePath = path.join(logDir, 'error.log')

// Путь к файлу логов для данных
const dataLogFilePath = path.join(logDir, 'data.log')

// Создание логгера для ошибок
const errorLogger = createLogger({
  level: 'error', // Уровень логирования (error)
  format: combine(
    timestamp(), // Добавление временной метки
    format.errors({ stack: true }), // Включение стека ошибок
    myFormat // Использование пользовательского формата
  ),
  transports: [
    // Транспорт для записи логов в файл
    new transports.File({ filename: errorLogFilePath, level: 'error' })
  ]
})

// Создание логгера для данных
const dataLogger = createLogger({
  level: 'info', // Уровень логирования (info)
  format: combine(
    timestamp(), // Добавление временной метки
    myFormat // Использование пользовательского формата
  ),
  transports: [
    // Транспорт для записи логов в файл
    new transports.File({ filename: dataLogFilePath, level: 'info' })
  ]
})

export { errorLogger, dataLogger }
