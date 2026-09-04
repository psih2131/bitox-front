import { MODAL_NAMES, useModalStore } from '~/stores/modal'

const YANDEX_COUNTER_ID = 110824008
const UTM_STORAGE_KEY = 'bitox_utm'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

function reachYandexGoal(goal) {
  if (!import.meta.client || !goal) return

  try {
    window.ym?.(YANDEX_COUNTER_ID, 'reachGoal', goal)
  } catch (error) {
    console.error('[yandex] reachGoal failed', error)
  }
}

function getErrorStatus(error) {
  return error?.statusCode || error?.status || error?.response?.status || null
}

function readStoredUtm() {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** First-touch UTM из URL; если в адресе нет — берём сохранённые за сессию. */
function getUtmParams() {
  if (!import.meta.client) return {}

  const fromUrl = {}
  const params = new URLSearchParams(window.location.search)

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim()
    if (value) fromUrl[key] = value
  }

  if (Object.keys(fromUrl).length) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl))
    } catch {
      // ignore quota / private mode
    }
    return fromUrl
  }

  return readStoredUtm()
}

export function useFormSubmit() {
  const modalStore = useModalStore()
  const isSubmitting = ref(false)

  function getPageUrl() {
    if (import.meta.client) return window.location.href

    try {
      return useRequestURL().href
    } catch {
      return ''
    }
  }

  async function submit(endpoint, body = {}, options = {}) {
    if (isSubmitting.value) return false

    if (typeof options.validate === 'function' && !options.validate()) {
      return false
    }

    isSubmitting.value = true

    try {
      await $fetch(endpoint, {
        method: 'POST',
        body: {
          ...body,
          url_page: body.url_page || getPageUrl(),
          utm: body.utm || getUtmParams(),
        },
      })

      reachYandexGoal(options.yandexGoal || 'form_success')

      modalStore.close()
      modalStore.open(MODAL_NAMES.formResult, { type: 'success' })
      return true
    } catch (error) {
      // Невалидные данные — не показываем «ошибку сервера»
      if (getErrorStatus(error) === 400) {
        return false
      }

      modalStore.close()
      modalStore.open(MODAL_NAMES.formResult, { type: 'error' })
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    submit,
  }
}
