import cron from 'node-cron'
import { CloseReports } from './closeReports.cron.js'

export function scheduleCloseReports() {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Starting daily close reports job...')
      const closeReportsInstance = new CloseReports()
      await closeReportsInstance.closeReports()
      console.log('Daily close reports job completed successfully.')
    } catch (error) {
      console.log('cron error :', error)
    }
  })
}
