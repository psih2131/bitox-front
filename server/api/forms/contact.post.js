import { escapeHtml, formatConsent, sendTelegramMessage } from '../../utils/telegram'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const firstName = body?.firstName?.trim()
  const lastName = body?.lastName?.trim()
  const phone = body?.phone?.trim()
  const consent = Boolean(body?.consent)

  if (!phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone is required',
    })
  }

  if (!consent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Consent is required',
    })
  }

  const message = [
    '<b>Новая заявка: Стать клиентом</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(firstName || '—')}`,
    `<b>Фамилия:</b> ${escapeHtml(lastName || '—')}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Согласие на обработку ПД:</b> ${formatConsent(consent)}`,
  ].join('\n')

  await sendTelegramMessage(event, message)

  return { ok: true }
})
