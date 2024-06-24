import upload from '../config/multer.config.js'
export class FileController {
  constructor() {}
  uploadFIle(req, res) {
    try {
      upload.single('photo')(req, res, (err) => {
        if (err) {
          console.error('Ошибка загрузки файла:', err)
          return res.status(500).send('Ошибка загрузки файла')
        }

        // Доступ к полям формы и файлу
        const { question1, question2, question3 } = req.body
        const photo = req.file

        console.log('Полученные данные:')
        console.log('Вопрос 1:', question1)
        console.log('Вопрос 2:', question2)
        console.log('Вопрос 3:', question3)
        console.log('Фото:', photo)

        // Логика обработки данных (например, сохранение в базе данных)

        // Отправка ответа клиенту
        res.status(200).json('success')
      })
    } catch (error) {
      console.error('Ошибка обработки запроса:', error)
      res.status(500).send('Внутренняя ошибка сервера')
    }
  }
}
