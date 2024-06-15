import 'dotenv/config'
const startDay = new Date(process.env.STARTDAY)
const endDay = new Date(process.env.ENDDAY)
export { startDay, endDay }
