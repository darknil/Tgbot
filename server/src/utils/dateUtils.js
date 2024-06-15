export function getPreviousDayRange() {
  const startOfDay = new Date()
  startOfDay.setDate(startOfDay.getDate() - 1)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setDate(endOfDay.getDate() - 1)
  endOfDay.setHours(23, 59, 59, 999)

  return { startOfDay, endOfDay }
}
