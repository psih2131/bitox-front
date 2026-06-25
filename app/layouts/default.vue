<template>
  <div class="app-wrapper">
    <AppHeader />
    <slot />
    <AppFooter />
    <AppCookieBanner />
    <AppModalController />
  </div>
</template>

<script setup>
const counterStore = useCounterStore()
const urlApi = useRuntimeConfig().public.apiUrl

const { data: globalInfoResponse } = await useFetch(`${urlApi}/api/global-info`)

counterStore.setGlobalInfo(globalInfoResponse.value?.data ?? null)
</script>
