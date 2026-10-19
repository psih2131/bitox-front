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

    <!-- После успешной заявки предлагаем написать в Telegram, не дожидаясь звонка -->
    <template v-if="isSuccess">
      <button
        type="button"
        class="app-btn form-result-modal__btn form-result-modal__btn--tg"
        :disabled="isOpeningBot"
        @click="openTelegramBot"
      >
        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M14.725 0.466725L12.3958 12.6265C12.3958 12.6265 12.0699 13.4696 11.1746 13.0653L5.80055 8.79825L5.77563 8.78567C6.50154 8.11068 12.1306 2.86956 12.3766 2.63199C12.7575 2.26406 12.521 2.04502 12.0788 2.32295L3.76401 7.79105L0.55617 6.67334C0.55617 6.67334 0.0513494 6.48739 0.00278445 6.08306C-0.0464195 5.67806 0.572784 5.45902 0.572784 5.45902L13.6502 0.146434C13.6502 0.146434 14.725 -0.342604 14.725 0.466725Z" fill="currentColor" />
        </svg>
        {{ isWorkingTime ? 'Написать в Telegram' : 'Оставить заявку в Telegram' }}
      </button>

      <button
        type="button"
        class="form-result-modal__link"
        @click="modalStore.close()"
      >
        Закрыть
      </button>
    </template>

    <button
      v-else
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
import { isExchangeCalcOffline } from '~/utils/isExchangeCalcOffline'

const modalStore = useModalStore()
const { payload } = storeToRefs(modalStore)

const isSuccess = computed(() => payload.value?.type === 'success')

// Рабочее время менеджеров — 10:00–22:00 по Москве (то же правило, что у калькулятора)
const isWorkingTime = ref(!isExchangeCalcOffline())

const message = computed(() => {
  if (!isSuccess.value) return 'Произошла ошибка сервера при отправке. Попробуйте позже.'

  return isWorkingTime.value
    ? 'В течение 15 минут с Вами свяжется менеджер, либо Вы можете связаться с нами сами.'
    : 'Менеджер свяжется с Вами в рабочее время, также Вы можете оставить заявку в Telegram.'
})

const { $TgAnalitika } = useNuxtApp()
const isOpeningBot = ref(false)

async function openTelegramBot() {
  if (isOpeningBot.value) return
  isOpeningBot.value = true

  // Вкладку открываем сразу по клику, иначе браузер может заблокировать её как всплывающее окно
  const tab = window.open('', '_blank')

  try {
    const result = await $TgAnalitika.trackEvent()
    const link = result?.data?.link

    if (tab && link) tab.location.href = link
    else if (link) window.location.href = link
    else tab?.close()
  } finally {
    isOpeningBot.value = false
  }
}

const titleId = 'form-result-modal-title'
</script>
