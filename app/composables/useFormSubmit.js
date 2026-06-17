import { MODAL_NAMES, useModalStore } from '~/stores/modal'

export function useFormSubmit() {
  const modalStore = useModalStore()
  const isSubmitting = ref(false)

  async function submit(endpoint, body) {
    if (isSubmitting.value) return false

    isSubmitting.value = true

    try {
      await $fetch(endpoint, {
        method: 'POST',
        body,
      })

      modalStore.close()
      modalStore.open(MODAL_NAMES.formResult, { type: 'success' })
      return true
    } catch {
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
