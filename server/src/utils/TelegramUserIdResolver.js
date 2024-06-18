// Import csv-parse with named import
import { parse } from 'csv-parse'
import fs from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

export class TelegramUserIdResolver {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath
    this.usersMap = new Map()
  }

  async initialize() {
    try {
      const fileData = await readFileAsync(this.csvFilePath, 'utf-8')
      const records = await this.parseCSV(fileData)

      records.forEach((record) => {
        this.usersMap.set(record.username, {
          UID: record.UID,
          Email: record.Email,
          mobile: record.mobile
        })
      })

      console.log('CSV файл успешно загружен и обработан.')
    } catch (err) {
      console.error('Ошибка при чтении CSV файла:', err)
      throw err
    }
  }

  async parseCSV(csvString) {
    return new Promise((resolve, reject) => {
      parse(csvString, { columns: true }, (err, records) => {
        if (err) {
          reject(err)
        } else {
          resolve(records)
        }
      })
    })
  }

  async getUserInfoByTelegramUsername(telegramUsername) {
    if (!this.usersMap.has(telegramUsername)) {
      throw new Error('Пользователь с таким Telegram username не найден.')
    }

    return this.usersMap.get(telegramUsername)
  }

  async userExists(telegramUsername) {
    return this.usersMap.has(telegramUsername)
  }
}
