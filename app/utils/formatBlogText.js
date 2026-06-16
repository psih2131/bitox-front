function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatBlogText(text) {
  if (!text) return ''

  return text
    .trim()
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim()

      if (trimmed.startsWith('### ')) {
        return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`
      }

      if (trimmed.startsWith('## ')) {
        return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`
      }

      const lines = trimmed.split('\n').map((line) => escapeHtml(line)).join('<br>')
      return `<p>${lines}</p>`
    })
    .join('')
}
