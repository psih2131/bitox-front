import { createFormRequest, escapeHtml, formatConsent, notifyTelegramSafe } from '../../utils/form-request'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const firstName = body?.firstName?.trim()
  const phone = body?.phone?.trim()
  const titleForm = body?.title_form?.trim() || 'Стать клиентом'
  const urlPage = body?.url_page?.trim() || ''
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

  await createFormRequest(event, {
    title_form: titleForm,
    url_page: urlPage,
    name: firstName || '',
    phone,
  })

  const message = [
    `<b>Новая заявка: ${escapeHtml(titleForm)}</b>`,
    '',
    `<b>Страница:</b> ${escapeHtml(urlPage || '—')}`,
    `<b>Как обращаться:</b> ${escapeHtml(firstName || '—')}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Согласие на обработку ПД:</b> ${formatConsent(consent)}`,
  ].join('\n')

  await notifyTelegramSafe(event, message)

  return { ok: true }
})
