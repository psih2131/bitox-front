<template>
  <div
    class="form-result-modal"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
  >
    <button
      type="button"
      class="form-result-modal__close"
      aria-label="Закрыть"
      @click="modalStore.close()"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <div
      class="form-result-modal__icon"
      :class="isSuccess ? 'form-result-modal__icon--success' : 'form-result-modal__icon--error'"
      aria-hidden="true"
    >
      <svg v-if="isSuccess" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16.5L13.5 22L24 11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 10V18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="16" cy="23" r="1.5" fill="currentColor" />
      </svg>
    </div>

    <h2 :id="titleId" class="form-result-modal__title">
      {{ isSuccess ? 'Заявка отправлена' : 'Не удалось отправить' }}
    </h2>

    <p class="form-result-modal__text">
      {{ message }}
    </p>

    <button
      type="button"
      class="app-btn form-result-modal__btn"
      @click="modalStore.close()"
    >
      Закрыть
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '~/stores/modal'

const modalStore = useModalStore()
const { payload } = storeToRefs(modalStore)

const isSuccess = computed(() => payload.value?.type === 'success')

const message = computed(() => (
  isSuccess.value
    ? 'Все отлично! Данные успешно отправлены.'
    : 'Произошла ошибка сервера при отправке. Попробуйте позже.'
))

const titleId = 'form-result-modal-title'
</script>
