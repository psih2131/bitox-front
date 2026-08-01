function toBitrixYesNo(value) {
  return value ? 'Y' : 'N'
}

function normalizeWebhookUrl(url) {
  if (!url) return ''
  return url.endsWith('/') ? url : `${url}/`
}

function compactFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== null),
  )
}

/**
 * Создаёт лид в Bitrix24. Ошибки глотаются — не влияет на ответ формы.
 * @param {import('h3').H3Event} event
 * @param {Record<string, unknown>} fields
 */
export async function notifyBitrixLeadSafe(event, fields = {}) {
  const config = useRuntimeConfig(event)
  const webhookUrl = normalizeWebhookUrl(config.bitrixWebhookUrl)

  if (!webhookUrl) {
    console.error('[bitrix] webhook URL is not configured')
    return
  }

  try {
    const response = await $fetch(`${webhookUrl}crm.lead.add.json`, {
      method: 'POST',
      body: {
        fields,
      },
    })

    if (response?.error) {
      console.error('[bitrix] crm.lead.add error', response.error, response.error_description)
    }
  } catch (error) {
    console.error('[bitrix] crm.lead.add failed', error)
  }
}

export function buildConsultationBitrixFields({
  title,
  phone,
  urlPage,
  personalConsent,
  offerConsent,
  marketingConsent,
  sourceId = 'WEB',
}) {
  return compactFields({
    TITLE: title || 'Консультация',
    SOURCE_ID: sourceId,
    PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }] : undefined,
    UF_CRM_1785502332723: urlPage || '',
    UF_CRM_1785501316992: toBitrixYesNo(personalConsent),
    UF_CRM_1785501333531: toBitrixYesNo(offerConsent),
    UF_CRM_1785501354530: toBitrixYesNo(marketingConsent),
  })
}

export function buildPaymentCalcBitrixFields({
  title,
  phone,
  urlPage,
  amount,
  currency,
  sourceId = 'WEB',
}) {
  const opportunity = amount ? Number(String(amount).replace(/\s/g, '').replace(',', '.')) : undefined

  return compactFields({
    TITLE: title || 'Рассчитайте платеж',
    SOURCE_ID: sourceId,
    PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }] : undefined,
    UF_CRM_1785502332723: urlPage || '',
    OPPORTUNITY: Number.isFinite(opportunity) ? opportunity : undefined,
    CURRENCY_ID: currency || undefined,
    // Согласие на ПД / рекламу (в форме калькулятора всегда да)
    UF_CRM_1785501279928: toBitrixYesNo(true),
    UF_CRM_1785501316992: toBitrixYesNo(true),
  })
}

export function buildContactBitrixFields({
  title,
  name,
  phone,
  urlPage,
  consent,
  sourceId = 'WEB',
}) {
  return compactFields({
    TITLE: title || 'Стать клиентом',
    SOURCE_ID: sourceId,
    NAME: name || undefined,
    PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }] : undefined,
    UF_CRM_1785502332723: urlPage || '',
    UF_CRM_1785501316992: toBitrixYesNo(consent),
  })
}
