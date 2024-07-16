export function getPreviousDayRange(daysBack = 0) {
  const startOfDay = new Date();
  startOfDay.setDate(startOfDay.getDate() - daysBack);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setDate(endOfDay.getDate() - daysBack);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}