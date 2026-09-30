import { calcCurrencyOrder } from '~/data/calc-currency-order'

function sortByCurrencyOrder(options, key) {
  const rank = (code) => {
    const i = calcCurrencyOrder.indexOf(code)
    return i === -1 ? Infinity : i
  }
  return options
    .map((item, index) => ({ item, index }))
    .sort((a, b) => rank(a.item[key]) - rank(b.item[key]) || a.index - b.index)
    .map(({ item }) => item)
}

export function parseAmount(value) {
  const normalized = String(value || '')
    .replace(/\s/g, '')
    .replace(',', '.')
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : 0
}

export function formatAmount(value, digits = 2) {
  if (!Number.isFinite(value)) return '—'

  return value.toLocaleString('ru-RU', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })
}

export function buildUniqueFromOptions(list) {
  const seen = new Map()

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (!seen.has(item.from)) {
      seen.set(item.from, {
        from: item.from,
        nameRuFrom: item.nameRuFrom,
      })
    }
  }

  return sortByCurrencyOrder(Array.from(seen.values()), 'from')
}

export function buildUniqueToOptions(list, fromCode) {
  const seen = new Map()

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.from !== fromCode) continue
    if (!seen.has(item.to)) {
      seen.set(item.to, {
        to: item.to,
        nameRuTo: item.nameRuTo,
      })
    }
  }

  return sortByCurrencyOrder(Array.from(seen.values()), 'to')
}

export function findRate(list, fromCode, toCode, preferCity) {
  const matches = []

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.from !== fromCode) continue
    if (item.to !== toCode) continue
    matches.push(item)
  }

  if (!matches.length) return null
  if (!preferCity) return matches[0]

  const preferred = matches.find((item) => item.city === preferCity)
  return preferred || matches[0]
}

export function calcReceiveAmount(giveAmount, rate) {
  if (!rate) return 0

  const rateIn = Number(rate.in)
  const rateOut = Number(rate.out)
  if (!rateIn || !Number.isFinite(rateIn) || !Number.isFinite(rateOut)) return 0

  return (giveAmount * rateOut) / rateIn
}
