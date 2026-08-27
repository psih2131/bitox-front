import { createHash } from 'node:crypto'
import { getRequestHeader, getResponseHeader, setResponseHeader, setResponseStatus } from 'h3'

function buildEtag(body) {
  return createHash('sha1').update(body).digest('hex')
}

function buildLastModified(hash) {
  // Stable date derived from content hash so repeat requests can get 304.
  const timestampMs = parseInt(hash.slice(0, 12), 16) % 2_000_000_000_000
  return new Date(timestampMs).toUTCString()
}

function isHtmlPage(event, body) {
  const path = event.path || ''
  if (path.startsWith('/api/') || path.startsWith('/_nuxt/')) return false
  if (typeof body !== 'string') return false

  const contentType = String(getResponseHeader(event, 'content-type') || '')
  if (contentType && !contentType.includes('text/html')) return false

  return body.includes('<html') || body.includes('<!DOCTYPE')
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (event.method !== 'GET' && event.method !== 'HEAD') return
    if (!isHtmlPage(event, response.body)) return

    const hash = buildEtag(response.body)
    const etag = `"${hash}"`
    const lastModified = buildLastModified(hash)

    setResponseHeader(event, 'ETag', etag)
    setResponseHeader(event, 'Last-Modified', lastModified)

    if (!getResponseHeader(event, 'cache-control')) {
      setResponseHeader(
        event,
        'Cache-Control',
        'public, max-age=600, s-maxage=600, stale-while-revalidate=60',
      )
    }

    const ifNoneMatch = getRequestHeader(event, 'if-none-match')
    if (ifNoneMatch && ifNoneMatch === etag) {
      setResponseStatus(event, 304)
      response.statusCode = 304
      response.body = ''
      return
    }

    const ifModifiedSince = getRequestHeader(event, 'if-modified-since')
    if (ifModifiedSince && ifModifiedSince === lastModified) {
      setResponseStatus(event, 304)
      response.statusCode = 304
      response.body = ''
    }
  })
})
