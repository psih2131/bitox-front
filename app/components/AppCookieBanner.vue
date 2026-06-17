<template>
  <div v-if="isVisible" class="cookie-banner">
    <p class="cookie-banner__text">
      Используя данный сайт, вы даёте согласие на использование файлов cookie,
      помогающих нам сделать его удобнее для вас
    </p>

    <button
      type="button"
      class="cookie-banner__btn"
      @click="acceptCookies"
    >
      ОК
    </button>
  </div>
</template>

<script setup>
const COOKIE_BANNER_KEY = 'cookie-banner-accepted'

const isVisible = ref(false)

onMounted(() => {
  if (!sessionStorage.getItem(COOKIE_BANNER_KEY)) {
    isVisible.value = true
  }
})

function acceptCookies() {
  sessionStorage.setItem(COOKIE_BANNER_KEY, '1')
  isVisible.value = false
}
</script>
