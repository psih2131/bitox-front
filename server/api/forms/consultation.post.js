import { escapeHtml, formatConsent, sendTelegramMessage } from '../../utils/telegram'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const phone = body?.phone?.trim()
  const personalConsent = Boolean(body?.personalConsent)
  const offerConsent = Boolean(body?.offerConsent)
  const marketingConsent = Boolean(body?.marketingConsent)

  if (!phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone is required',
    })
  }

  if (!personalConsent || !offerConsent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Required consents are missing',
    })
  }

  const message = [
    '<b>Новая заявка: Консультация</b>',
    '',
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Согласие на обработку ПД:</b> ${formatConsent(personalConsent)}`,
    `<b>Согласие с офертой:</b> ${formatConsent(offerConsent)}`,
    `<b>Рекламная рассылка:</b> ${formatConsent(marketingConsent)}`,
  ].join('\n')

  await sendTelegramMessage(event, message)

  return { ok: true }
})
