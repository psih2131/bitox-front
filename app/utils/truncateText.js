export function truncateText(text, maxLength = 50) {
  if (!text) return ''

  const plainText = text.replace(/<[^>]*>/g, '').trim()

  if (plainText.length <= maxLength) return plainText

  return `${plainText.slice(0, maxLength)}...`
}
