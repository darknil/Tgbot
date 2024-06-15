const QuestionDTO = {
  id: Number,
  body: String,
  answer: String // Необязательное поле
}

// DTO для отчета
const ReportDTO = {
  id: Number,
  ownerId: String, // ObjectId в виде строки
  questions: [QuestionDTO],
  date: Date,
  isClosed: Boolean // Необязательное поле, по умолчанию false
}

export { ReportDTO, QuestionDTO }
