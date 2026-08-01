import { buildPaymentCalcBitrixFields, notifyBitrixLeadSafe } from '../../utils/bitrix'
import { createFormRequest, escapeHtml, notifyTelegramSafe } from '../../utils/form-request'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const amount = body?.amount?.trim()
  const phone = body?.phone?.trim()
  const currency = body?.currency?.trim()
  const titleForm = body?.title_form?.trim() || 'Рассчитайте платеж'
  const urlPage = body?.url_page?.trim() || ''

  if (!phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone is required',
    })
  }

  const message = [
    `<b>Новая заявка: ${escapeHtml(titleForm)}</b>`,
    '',
    `<b>Страница:</b> ${escapeHtml(urlPage || '—')}`,
    `<b>Сумма:</b> ${escapeHtml(amount || '—')}${currency ? ` ${escapeHtml(currency)}` : ''}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    '<b>Согласие на обработку ПД и рекламу:</b> Да',
  ].join('\n')

  const bitrixFields = buildPaymentCalcBitrixFields({
    title: titleForm,
    phone,
    urlPage,
    amount,
    currency,
  })

  const [strapiResult] = await Promise.allSettled([
    createFormRequest(event, {
      title_form: titleForm,
      url_page: urlPage,
      phone,
    }),
    notifyTelegramSafe(event, message),
    notifyBitrixLeadSafe(event, bitrixFields),
  ])

  if (strapiResult.status === 'rejected') {
    throw strapiResult.reason
  }

  return { ok: true }
})
