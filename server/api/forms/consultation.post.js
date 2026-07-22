import { createFormRequest, escapeHtml, formatConsent, notifyTelegramSafe } from '../../utils/form-request'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const phone = body?.phone?.trim()
  const titleForm = body?.title_form?.trim() || 'Консультация'
  const urlPage = body?.url_page?.trim() || ''
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

  await createFormRequest(event, {
    title_form: titleForm,
    url_page: urlPage,
    phone,
  })

  const message = [
    `<b>Новая заявка: ${escapeHtml(titleForm)}</b>`,
    '',
    `<b>Страница:</b> ${escapeHtml(urlPage || '—')}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Согласие на обработку ПД:</b> ${formatConsent(personalConsent)}`,
    `<b>Согласие с офертой:</b> ${formatConsent(offerConsent)}`,
    `<b>Рекламная рассылка:</b> ${formatConsent(marketingConsent)}`,
  ].join('\n')

  await notifyTelegramSafe(event, message)

  return { ok: true }
})
