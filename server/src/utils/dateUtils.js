export function getPreviousDayRange() {
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setUTCHours(23, 59, 59, 999)

  return { startOfDay, endOfDay }
}
