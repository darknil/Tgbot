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

// Путь к файлу логов
const logFilePath = path.join(logDir, 'error.log')

// Создание логгера
const logger = createLogger({
  level: 'error', // Уровень логирования (error)
  format: combine(
    timestamp(), // Добавление временной метки
    format.errors({ stack: true }), // Включение стека ошибок
    myFormat // Использование пользовательского формата
  ),
  transports: [
    // Транспорт для записи логов в файл
    new transports.File({ filename: logFilePath, level: 'error' })
  ]
})

export default logger
