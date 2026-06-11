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
const isVisible = ref(true)

function acceptCookies() {
  isVisible.value = false
}
</script>
