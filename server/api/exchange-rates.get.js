import { fetchExchangeRates } from '../utils/parserXmlCalc'

export default defineEventHandler(async () => {
  try {
    return await fetchExchangeRates()
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to load exchange rates',
      data: error?.message,
    })
  }
})
