import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../public/images')
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, `${req.filename}.jpg`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
})

export default upload
