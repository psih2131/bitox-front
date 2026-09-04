<template>
  <div class="consultation-modal" role="dialog" aria-modal="true" aria-labelledby="consultation-modal-title">
    <button
      type="button"
      class="consultation-modal__close"
      aria-label="Закрыть"
      @click="modalStore.close()"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <p class="consultation-modal__subtitle">Позвоним вам в течении 30 минут</p>

    <h2 id="consultation-modal-title" class="consultation-modal__title">
      Менеджер ответит на вопросы и расскажет про возможности и преимущества нашего сервиса
    </h2>

    <form class="consultation-modal__form" @submit.prevent="handleSubmit">
      <label class="consultation-modal__field">
        <span class="consultation-modal__label">Номер телефона</span>

        <div class="consultation-modal__control consultation-modal__control--phone">
          <img :src="flagRu" alt="" class="consultation-modal__flag" width="24" height="16" />
          <input
            :value="phone"
            type="tel"
            maxlength="18"
            inputmode="numeric"
            class="consultation-modal__input"
            placeholder="+7 (999) 999 99 99"
            autocomplete="tel"
            @keydown="onPhoneKeydown"
            @input="onPhoneInput"
          />
        </div>
      </label>

      <label class="consultation-modal__checkbox">
        <input v-model="personalConsent" type="checkbox" />
        <span class="consultation-modal__checkbox-text">
          Я даю согласие на обработку своих персональных данных
        </span>
      </label>

      <label class="consultation-modal__checkbox">
        <input v-model="offerConsent" type="checkbox" />
        <span class="consultation-modal__checkbox-text">
          Согласен с условиями публичной оферты о заключении договора оказания
          информационно-консультационных услуг
        </span>
      </label>

      <label class="consultation-modal__checkbox">
        <input v-model="marketingConsent" type="checkbox" />
        <span class="consultation-modal__checkbox-text">
          Я даю согласие на получение рекламной и информационной рассылки
        </span>
      </label>

      <button
        type="submit"
        class="app-btn consultation-modal__submit"
        :disabled="!canSubmit || isSubmitting"
      >
        {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { useModalStore } from '~/stores/modal'
import flagRu from '~/assets/images/flags/russian.png'

const modalStore = useModalStore()
const { isSubmitting, submit } = useFormSubmit()

const phone = ref('+7 ')
const personalConsent = ref(true)
const offerConsent = ref(true)
const marketingConsent = ref(true)

const canSubmit = computed(
  () => phone.value.replace(/\D/g, '').length === 11 && personalConsent.value && offerConsent.value,
)

function onPhoneKeydown(event) {
  const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowed.includes(event.key) || event.ctrlKey || event.metaKey) return
  if (!/^\d$/.test(event.key)) event.preventDefault()
}

function onPhoneInput({ target }) {
  const n = target.value.replace(/\D/g, '').replace(/^7|^8/, '').slice(0, 10)
  phone.value = n
    ? `+7 (${n.slice(0, 3)}${n.length > 3 ? `) ${n.slice(3, 6)}` : ''}${n.length > 6 ? ` ${n.slice(6, 8)}` : ''}${n.length > 8 ? ` ${n.slice(8, 10)}` : ''}`
    : '+7 '
  target.value = phone.value
}

async function handleSubmit() {
  if (isSubmitting.value) return

  await submit('/api/forms/consultation', {
    title_form: 'Консультация',
    phone: phone.value.trim(),
    personalConsent: personalConsent.value,
    offerConsent: offerConsent.value,
    marketingConsent: marketingConsent.value,
  }, {
    validate: () => canSubmit.value,
  })
}
</script>
