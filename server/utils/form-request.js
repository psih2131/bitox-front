import { escapeHtml, formatConsent, sendTelegramMessage } from './telegram'

export async function createFormRequest(event, data) {
  const config = useRuntimeConfig(event)
  const apiUrl = config.public.apiUrl

  if (!apiUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Strapi API URL is not configured',
    })
  }

  try {
    return await $fetch(`${apiUrl}/api/form-requests/submit`, {
      method: 'POST',
      body: {
        data,
      },
    })
  } catch (error) {
    console.error('[form-request] Strapi create failed', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to create form request in Strapi',
    })
  }
}

export async function notifyTelegramSafe(event, message) {
  try {
    await sendTelegramMessage(event, message)
  } catch (error) {
    console.error('[form-request] Telegram notify failed', error)
  }
}

export { escapeHtml, formatConsent }
