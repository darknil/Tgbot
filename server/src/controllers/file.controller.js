import upload from '../config/multer.config.js'
import s3 from '../config/AWS.config.js' // Импорт настроенного S3 клиента

import path from 'path'
import fs from 'fs/promises' // Используем промисы для асинхронных операций с файлами
import { fileURLToPath } from 'url'
import { promisify } from 'util'

import 'dotenv/config'

import { ReportService } from '../services/report.service.js'
import { ResponseService } from '../services/response.service.js'

const bucketName = process.env.AWS_BUCKET_NAME
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class FileController {
  constructor() {
    this.ReportService = new ReportService()
    this.ResponseService = new ResponseService()
  }

  uploadReportImage = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }

      const uploadSingle = promisify(upload.single('image'))
      await uploadSingle(req, res)

      if (!req.file) {
        return res.status(400).send('No file uploaded')
      }

      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename)
      const reportId = req.params.reportId
      const report = await this.ReportService.getReportById(reportId)
      if (!report) {
        return this.ResponseService.notFound(res, 'Report not found')
      }
      const originalFilename = `report_${reportId}_fullsize.jpg`

      try {
        const uploaded = await this.uploadOriginalToStorage(
          filePath,
          originalFilename
        )
        if (!uploaded) {
          return this.ResponseService.badRequest(res, 'Error uploading file')
        }
        // Cleanup local files
        await this.deleteLocalFile(filePath)

        // Get public URL for viewing the uploaded file
        const publicUrl = `https://s3.timeweb.cloud/${bucketName}/profilePics/${originalFilename}`
        console.log('File uploaded to:', [publicUrl])
        await this.ReportService.updateReportField(
          reportId,
          'photoUrl',
          publicUrl
        )
        res
          .status(200)
          .send({
            message: 'File uploaded and added to report successfully',
            publicUrl
          })
      } catch (error) {
        console.error('Error uploading file:', error)
        res.status(500).send('Error uploading file')
      }
    } catch (error) {
      console.error('uploadReportImage error:', error)
      res.status(500).send('Unexpected error')
    }
  }

  uploadOriginalToStorage = async (filePath, originalFilename) => {
    const params = {
      Bucket: bucketName,
      Key: `profilePics/${originalFilename}`,
      Body: await fs.readFile(filePath),
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    }

    try {
      const data = await s3.upload(params).promise()
      console.log(`${filePath} uploaded to ${bucketName}`)
      return data
    } catch (error) {
      console.error('Error uploading to S3:', error)
      throw error // Пробрасываем ошибку дальше для обработки
    }
  }

  deleteLocalFile = async (filePath) => {
    try {
      await fs.unlink(filePath)
      console.log(`File ${filePath} successfully deleted`)
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error)
    }
  }
}
