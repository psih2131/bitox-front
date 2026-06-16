export default defineNuxtPlugin((nuxtApp) => {
  const scrollToHash = (hash) => {
    if (!hash || hash === '#') return

    const id = decodeURIComponent(hash.replace('#', ''))
    const target = document.getElementById(id)

    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]')

    if (!link) return

    const hash = link.getAttribute('href')
    const id = hash?.slice(1)

    if (!id || !document.getElementById(id)) return

    event.preventDefault()
    history.pushState(null, '', hash)
    scrollToHash(hash)
  })

  nuxtApp.hook('page:finish', () => {
    if (!window.location.hash) return

    requestAnimationFrame(() => {
      scrollToHash(window.location.hash)
    })
  })
})
