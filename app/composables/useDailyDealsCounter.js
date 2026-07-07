const START_AMOUNT = 200_000
const END_AMOUNT_BASE = 3_000_000
const DAY_START_HOUR_MSK = 8
const DAY_END_HOUR_MSK = 24
const MSK_TZ = 'Europe/Moscow'
const DAY_DURATION_SECONDS = (DAY_END_HOUR_MSK - DAY_START_HOUR_MSK) * 3600

const dayPlanCache = new Map()

function hashString(value) {
  let hash = 0

  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i)
    hash |= 0
  }

  return hash
}

function createSeededRandom(seed) {
  let state = seed | 0

  return () => {
    state = (state + 0x6D2B79F5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getMskNow() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: MSK_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date())
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  }
}

function getSecondsSinceStart(msk) {
  const elapsed = msk.hour * 3600 + msk.minute * 60 + msk.second
  const start = DAY_START_HOUR_MSK * 3600

  if (elapsed < start) return -1
  if (elapsed >= DAY_END_HOUR_MSK * 3600) return DAY_DURATION_SECONDS

  return elapsed - start
}

function buildDayPlan(dateKey) {
  const random = createSeededRandom(hashString(dateKey))
  const targetEnd = Math.round(END_AMOUNT_BASE + (random() - 0.5) * 200_000)
  const totalToAdd = targetEnd - START_AMOUNT
  const eventsCount = Math.floor(350 + random() * 250)
  const weights = Array.from({ length: eventsCount }, () => random() + 0.15)
  const weightsSum = weights.reduce((sum, weight) => sum + weight, 0)

  const events = weights.map((weight, index) => ({
    timeOffset: random() * DAY_DURATION_SECONDS,
    amount: Math.round((weight / weightsSum) * totalToAdd),
  }))

  events.sort((a, b) => a.timeOffset - b.timeOffset)

  const allocated = events.reduce((sum, event) => sum + event.amount, 0)
  events[events.length - 1].amount += totalToAdd - allocated

  return { events, targetEnd }
}

function getDayPlan(dateKey) {
  if (!dayPlanCache.has(dateKey)) {
    dayPlanCache.set(dateKey, buildDayPlan(dateKey))
  }

  return dayPlanCache.get(dateKey)
}

export function getDailyDealsAmount(dateKey, secondsSinceStart) {
  const { events, targetEnd } = getDayPlan(dateKey)

  if (secondsSinceStart < 0) return START_AMOUNT
  if (secondsSinceStart >= DAY_DURATION_SECONDS) return targetEnd

  return START_AMOUNT + events
    .filter((event) => event.timeOffset <= secondsSinceStart)
    .reduce((sum, event) => sum + event.amount, 0)
}

export function formatDailyDealsAmount(amount) {
  return `${Math.round(amount).toLocaleString('de-DE')} $`
}

export function useDailyDealsCounter() {
  const totalAmountToday = ref('')

  let timer = null

  const updateAmount = () => {
    const msk = getMskNow()
    const secondsSinceStart = getSecondsSinceStart(msk)
    const amount = getDailyDealsAmount(msk.dateKey, secondsSinceStart)

    totalAmountToday.value = formatDailyDealsAmount(amount)
  }

  updateAmount()

  onMounted(() => {
    updateAmount()
    timer = setInterval(updateAmount, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return {
    totalAmountToday,
  }
}
