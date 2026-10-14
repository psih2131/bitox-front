// Даты статей блога.
// Опубликовано — дата первой публикации (first_published_at из админки).
// Обновлено — показываем, только если статью меняли хотя бы на следующий день после публикации.

const TIME_ZONE = 'Europe/Moscow'

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function dayKey(date) {
  // 2026-10-14 — удобно сравнивать как строки
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getPostPublishedDate(post) {
  return post?.first_published_at || post?.publishedAt || null
}

export function getPostUpdatedDate(post) {
  const published = toDate(getPostPublishedDate(post))
  const updated = toDate(post?.updatedAt)
  if (!published || !updated) return null

  return dayKey(updated) > dayKey(published) ? post.updatedAt : null
}

export function formatPostDate(value) {
  const date = toDate(value)
  if (!date) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
