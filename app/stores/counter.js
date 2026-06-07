import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
    const serverUrlDomainRequest = ref('https://red-angels-server.ru')



    // const changeOptionData = (newData) => {
    //     optionsData.value = newData
    //     console.log('new value store', optionsData.value)
    // }



    return {
        serverUrlDomainRequest,
    }
})