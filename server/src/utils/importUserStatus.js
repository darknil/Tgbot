import { StatusService } from '../services/status.service.js'
import { parse } from 'csv-parse'
import fs from 'fs'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import path from 'path'

const readFileAsync = promisify(fs.readFile)

export async function importUsersStatusFromCSV(csvFileName) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const csvFilePath = path.join(__dirname, `../config/${csvFileName}.csv`)

  const importData = new ImportData(csvFilePath)
  await delay(5000)
  await importData.fillStatusInDataBase()
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class ImportData {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath
    this.StatusService = new StatusService()
    this.usersMap = new Map()
  }

  async fillStatusInDataBase() {
    try {
      const fileData = await readFileAsync(this.csvFilePath, 'utf-8')
      const records = await this.parseCSV(fileData)
      for (const record of records) {
        this.usersMap.set(record.value, {
          value: record.value
        })

        try {
          await this.StatusService.createStatus(record.value)
          console.log(`Статус ${record.value} успешно добавлен.`)
        } catch (error) {
          console.error(
            `Ошибка при добавлении статуса ${record.value} в базу данных:`,
            error
          )
        }
      }

      console.log('Data import successful')
    } catch (error) {
      console.log('fill users in data base error', error)
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
}
