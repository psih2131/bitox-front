function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function formatConsent(value) {
  return value ? 'Да' : 'Нет'
}

export { escapeHtml }

export async function sendTelegramMessage(event, text) {
  const config = useRuntimeConfig(event)
  const botToken = config.botToken
  const groupId = config.groupId

  if (!botToken || !groupId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Telegram is not configured',
    })
  }

  const response = await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    body: {
      chat_id: groupId,
      text,
      parse_mode: 'HTML',
    },
  })

  if (!response?.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to send Telegram message',
    })
  }

  return response
}
