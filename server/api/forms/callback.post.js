import { escapeHtml, formatConsent, sendTelegramMessage } from '../../utils/telegram'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const name = body?.name?.trim()
  const phone = body?.phone?.trim()
  const problem = body?.problem?.trim()
  const paymentVolume = body?.paymentVolume?.trim()
  const countriesCurrencies = body?.countriesCurrencies?.trim()
  const personalConsent = Boolean(body?.personalConsent)
  const offerConsent = Boolean(body?.offerConsent)
  const marketingConsent = Boolean(body?.marketingConsent)

  if (!name || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and phone are required',
    })
  }

  if (!personalConsent || !offerConsent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Required consents are missing',
    })
  }

  const message = [
    '<b>Новая заявка: Обратный звонок</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Проблема:</b> ${escapeHtml(problem || '—')}`,
    `<b>Объем платежа:</b> ${escapeHtml(paymentVolume || '—')}`,
    `<b>Страны и валюты:</b> ${escapeHtml(countriesCurrencies || '—')}`,
    '',
    `<b>Согласие на обработку ПД:</b> ${formatConsent(personalConsent)}`,
    `<b>Согласие с офертой:</b> ${formatConsent(offerConsent)}`,
    `<b>Рекламная рассылка:</b> ${formatConsent(marketingConsent)}`,
  ].join('\n')

  await sendTelegramMessage(event, message)

  return { ok: true }
})
