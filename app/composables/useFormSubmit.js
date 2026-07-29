import { MODAL_NAMES, useModalStore } from '~/stores/modal'

const YANDEX_COUNTER_ID = 110824008

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
