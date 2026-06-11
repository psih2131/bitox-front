import { ref } from 'vue'
import { defineStore } from 'pinia'

export const MODAL_NAMES = {
  consultation: 'consultation',
}

export const useModalStore = defineStore('modal', () => {
  const popup = ref({
    name: '',
    isOpen: false,
  })

  function open(name) {
    popup.value = {
      name,
      isOpen: true,
    }
  }

  function close() {
    popup.value = {
      name: '',
      isOpen: false,
    }
  }

  return {
    popup,
    open,
    close,
  }
})
