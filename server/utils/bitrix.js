function toBitrixYesNo(value) {
  return value ? 'Y' : 'N'
}

function normalizeWebhookUrl(url) {
  if (!url) return ''
  return url.endsWith('/') ? url : `${url}/`
}

function compactFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

const UTM_QUERY_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

/**
 * Достаёт UTM из явных полей и/или из URL страницы.
 * Маппит в стандартные поля лида Bitrix24.
 */
export function buildBitrixUtmFields(urlPage = '', explicitUtm = {}) {
  const fromUrl = {}

  if (urlPage) {
    try {
      const url = new URL(urlPage, 'https://bitox.global')
      for (const key of UTM_QUERY_KEYS) {
        const value = url.searchParams.get(key)?.trim()
        if (value) fromUrl[key] = value
      }
    } catch {
      // ignore invalid url
    }
  }

  const pick = (key) => {
    const explicit = explicitUtm?.[key]
    if (typeof explicit === 'string' && explicit.trim()) return explicit.trim()
    return fromUrl[key] || undefined
  }

  return compactFields({
    UTM_SOURCE: pick('utm_source'),
    UTM_MEDIUM: pick('utm_medium'),
    UTM_CAMPAIGN: pick('utm_campaign'),
    UTM_CONTENT: pick('utm_content'),
    UTM_TERM: pick('utm_term'),
  })
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
  utm,
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
    ...buildBitrixUtmFields(urlPage, utm),
  })
}

export function buildPaymentCalcBitrixFields({
  title,
  phone,
  urlPage,
  utm,
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
    ...buildBitrixUtmFields(urlPage, utm),
  })
}

export function buildContactBitrixFields({
  title,
  name,
  phone,
  urlPage,
  utm,
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
    ...buildBitrixUtmFields(urlPage, utm),
  })
}
