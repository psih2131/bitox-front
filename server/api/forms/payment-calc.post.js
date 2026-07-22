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

  await createFormRequest(event, {
    title_form: titleForm,
    url_page: urlPage,
    phone,
  })

  const message = [
    `<b>Новая заявка: ${escapeHtml(titleForm)}</b>`,
    '',
    `<b>Страница:</b> ${escapeHtml(urlPage || '—')}`,
    `<b>Сумма:</b> ${escapeHtml(amount || '—')}${currency ? ` ${escapeHtml(currency)}` : ''}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    '<b>Согласие на обработку ПД и рекламу:</b> Да',
  ].join('\n')

  await notifyTelegramSafe(event, message)

  return { ok: true }
})
