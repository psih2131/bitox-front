import { XMLParser } from 'fast-xml-parser'

const RATES_URL = 'https://bitox.net/exports/kurs.xml'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  isArray: (name) => name === 'item',
})

export async function fetchExchangeRates() {
  const xml = await $fetch(RATES_URL, {
    responseType: 'text',
  })

  const parsed = parser.parse(xml)
  const rates = parsed?.rates || {}
  const items = Array.isArray(rates.item) ? rates.item : []

  return {
    generatedAt: rates.generated_at || null,
    items,
  }
}
