import { escapeHtml, sendTelegramMessage } from '../../utils/telegram'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const amount = body?.amount?.trim()
  const phone = body?.phone?.trim()
  const currency = body?.currency?.trim()

  if (!amount || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Amount and phone are required',
    })
  }

  if (!currency) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Currency is required',
    })
  }

  const message = [
    '<b>Новая заявка: Рассчитать платеж</b>',
    '',
    `<b>Сумма:</b> ${escapeHtml(amount)} ${escapeHtml(currency)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    '<b>Согласие на обработку ПД и рекламу:</b> Да',
  ].join('\n')

  await sendTelegramMessage(event, message)

  return { ok: true }
})
