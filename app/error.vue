<template>
  <NuxtLayout>
    <main class="not-found-page">
      <NotFoundHeroSec v-if="isNotFound" />
      <ServiceContactSec />
    </main>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: isNotFound.value ? 'Ошибка 404 — Bitox' : `Ошибка ${props.error.statusCode} — Bitox`,
  robots: 'noindex, nofollow',
})
</script>
