import { ref } from 'vue'
import { defineStore } from 'pinia'

export const MODAL_NAMES = {
  consultation: 'consultation',
  callback: 'callback',
  formResult: 'formResult',
  promo: 'promo',
}

export const useModalStore = defineStore('modal', () => {
  const name = ref('')
  const isOpen = ref(false)
  const payload = ref(null)

  function open(modalName, data = null) {
    name.value = modalName
    payload.value = data
    isOpen.value = true
  }

  function close() {
    name.value = ''
    payload.value = null
    isOpen.value = false
  }

  return {
    name,
    isOpen,
    payload,
    open,
    close,
  }
})
