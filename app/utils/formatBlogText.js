import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

export function formatBlogText(text) {
  if (!text) return ''

  return md.render(String(text).trim())
}

export function hasRichTextContent(value) {
  if (!value) return false

  const text = String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()

  return text.length > 0
}

export function renderRichText(text) {
  if (!text) return ''

  const trimmed = String(text).trim()
  if (!trimmed) return ''

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
  }

  return formatBlogText(trimmed)
}
