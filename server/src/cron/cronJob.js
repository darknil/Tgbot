import cron from 'node-cron'
cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily close reports job...')
  await closeReportsInstance.closeReports()
  console.log('Daily close reports job completed successfully.')
})
