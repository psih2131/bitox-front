const WIDGET_CONFIG_SRC =
  'https://cdn-us-east-1.chatapp.online/cabinet.chatapp.online/widgetsFiles/83456/2026/07/03/51b84000-95fe-4ce5-b901-c756b326f944.js'
const WIDGET_RUNTIME_SRC =
  'https://cdn-us-east-1.chatapp.online/cabinet.chatapp.online/external/widget/v3/index.js'

function withCacheBust(url) {
  return `${url}?${(Date.now() / 60000) | 0}`
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.defer = true
    script.src = withCacheBust(src)
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

async function loadChatAppWidget() {
  if (window.__bitoxChatAppLoading) return
  window.__bitoxChatAppLoading = true

  try {
    await loadScript(WIDGET_CONFIG_SRC)
    await loadScript(WIDGET_RUNTIME_SRC)
  } catch (error) {
    console.error('[chatapp] widget load failed', error)
    window.__bitoxChatAppLoading = false
  }
}

function loadAfterPageReady() {
  const start = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadChatAppWidget(), { timeout: 2000 })
    } else {
      window.setTimeout(loadChatAppWidget, 0)
    }
  }

  if (document.readyState === 'complete') {
    start()
    return
  }

  window.addEventListener('load', start, { once: true })
}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return
  loadAfterPageReady()
})
