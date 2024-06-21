import cron from 'node-cron'
import { CloseReports } from './closeReports.cron'
const closeReportsInstance = new CloseReports()
export function scheduleCloseReports() {
  cron.schedule('0 3 * * *', async () => {
    try {
      console.log('Starting daily close reports job...')
      await closeReportsInstance.closeReports()
      console.log('Daily close reports job completed successfully.')
    } catch (error) {}
  })
}
