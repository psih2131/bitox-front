import { MODAL_NAMES, useModalStore } from '~/stores/modal'

const SESSION_KEY = 'bitox_promo_modal_shown'
const DELAY_MS = 30_000

export function usePromoModalTrigger() {
  const modalStore = useModalStore()
  let timerId = null

  function markShown() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // ignore storage errors
    }
  }

  function wasShown() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      return false
    }
  }

  function tryOpenPromo() {
    if (wasShown()) return

    markShown()

    if (!modalStore.isOpen) {
      modalStore.open(MODAL_NAMES.promo)
    }
  }

  function start() {
    if (!import.meta.client || wasShown()) return

    timerId = window.setTimeout(tryOpenPromo, DELAY_MS)
  }

  function stop() {
    if (timerId != null) {
      window.clearTimeout(timerId)
      timerId = null
    }
  }

  onMounted(start)
  onUnmounted(stop)
}
