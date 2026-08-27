const WIDGET_BUTTON_SELECTOR = 'button[data-testingid="widget-button"]'
const ARIA_LABEL = 'Открыть чат'

function labelWidgetButton(root = document) {
  const buttons = root.querySelectorAll?.(WIDGET_BUTTON_SELECTOR)
  if (!buttons?.length) return false

  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', ARIA_LABEL)
    }
  })

  return true
}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  if (labelWidgetButton()) return

  const observer = new MutationObserver(() => {
    if (labelWidgetButton()) {
      observer.disconnect()
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
})
