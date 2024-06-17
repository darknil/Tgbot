import 'dotenv/config'
const STARTDAY = process.env.STARTDAY
const ENDDAY = process.env.ENDDAY
const startDay = new Date(STARTDAY)
const endDay = new Date(ENDDAY)
export { startDay, endDay }
