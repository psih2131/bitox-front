const COUNTER_ID = 110824008
const SCRIPT_SRC = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`
const LOAD_DELAY_MS = 4000

function ensureYmStub() {
  window.ym =
    window.ym ||
    function (...args) {
      ;(window.ym.a = window.ym.a || []).push(args)
    }
  window.ym.l = Date.now()
}

function getInitOptions() {
  return {
    ssr: true,
    webvisor: false,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  }
}

function loadMetrika() {
  if (window.__bitoxMetrikaLoading) return
  window.__bitoxMetrikaLoading = true

  ensureYmStub()

  if (document.querySelector(`script[src^="https://mc.yandex.ru/metrika/tag.js"]`)) {
    window.ym(COUNTER_ID, 'init', getInitOptions())
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = SCRIPT_SRC
  script.onload = () => {
    window.ym(COUNTER_ID, 'init', getInitOptions())
  }
  document.head.appendChild(script)
}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  ensureYmStub()

  let loaded = false
  let timeoutId = null

  const events = ['scroll', 'click', 'touchstart', 'keydown']

  const cleanup = () => {
    events.forEach((event) => window.removeEventListener(event, trigger, { capture: true }))
    clearTimeout(timeoutId)
  }

  const trigger = () => {
    if (loaded) return
    loaded = true
    cleanup()
    loadMetrika()
  }

  events.forEach((event) =>
    window.addEventListener(event, trigger, { once: true, passive: true, capture: true }),
  )

  timeoutId = window.setTimeout(trigger, LOAD_DELAY_MS)
})
