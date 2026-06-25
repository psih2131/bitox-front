import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const serverUrlDomainRequest = ref('https://red-angels-server.ru')
  const globalInfo = ref(null)

  function setGlobalInfo(data) {
    globalInfo.value = data
  }

  return {
    serverUrlDomainRequest,
    globalInfo,
    setGlobalInfo,
  }
})
