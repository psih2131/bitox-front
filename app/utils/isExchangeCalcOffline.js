/**
 * Проверяет, выключен ли калькулятор по расписанию 10:00–22:00 UTC+3.
 * @param {Date} [date]
 * @returns {boolean} true — калькулятор выключен (вне рабочего времени)
 */
export function isExchangeCalcOffline(date = new Date()) {
  const utc3OffsetMs = 3 * 60 * 60 * 1000
  const local = new Date(date.getTime() + utc3OffsetMs)
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes()
  const openAt = 10 * 60
  const closeAt = 22 * 60

  return minutes < openAt || minutes >= closeAt
}
