import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

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

// Настройка логгера для ошибок с ежедневной ротацией
const errorLogger = createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    format.errors({ stack: true }),
    myFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    })
  ]
})

// Настройка логгера для данных с ежедневной ротацией
const dataLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'data-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    })
  ]
})

export { errorLogger, dataLogger }