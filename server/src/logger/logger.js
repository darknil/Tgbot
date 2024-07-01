import { createLogger, format, transports } from 'winston'
import path from 'path'

const { combine, timestamp, printf } = format

// Формат для вывода логов
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

// Путь к файлу логов
const logFilePath = path.resolve('logs/error.log')

// Создание логера
const logger = createLogger({
  level: 'error', // Уровень логирования (error)
  format: combine(
    timestamp(), // Добавление временной метки
    myFormat // Использование пользовательского формата
  ),
  transports: [
    // Транспорт для записи логов в файл
    new transports.File({ filename: logFilePath, level: 'error' })
  ]
})

export default logger
