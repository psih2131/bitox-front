<template>
  <div class="payment-calc">
    <h2 class="payment-calc__title">Рассчитайте платеж</h2>

    <form class="payment-calc__form" @submit.prevent="handleSubmit">
      <label class="payment-calc__field">
        <span class="payment-calc__label">Сумма</span>
        <div class="payment-calc__input-wrap">
          <span v-if="selectedCurrency?.symbol" class="payment-calc__currency-symbol">{{ selectedCurrency.symbol }}</span>
          <input
            v-model="amount"
            type="text"
            class="payment-calc__input"
            placeholder=""
          />

          <div
            v-if="currencies.length"
            ref="currencyRef"
            class="payment-calc__currency-wrap"
          >
            <button
              type="button"
              class="payment-calc__currency"
              :class="{ 'payment-calc__currency--open': isCurrencyOpen }"
              :aria-expanded="isCurrencyOpen"
              aria-haspopup="listbox"
              @click="toggleCurrency"
            >
              <img
                v-if="selectedCurrency?.flag"
                :src="selectedCurrency.flag"
                :alt="selectedCurrency.code"
                class="payment-calc__flag"
                width="21"
                height="21"
              />
              <span v-if="selectedCurrency?.code">{{ selectedCurrency.code }}</span>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M4.5 0.5L8.5 8.5H0.5L4.5 0.5Z" fill="#606061" />
              </svg>
            </button>

            <ul
              v-if="isCurrencyOpen"
              class="payment-calc__currency-list"
              role="listbox"
              :aria-label="`Валюта, выбрано ${selectedCurrency?.code || ''}`"
            >
              <li
                v-for="currency in currencies"
                :key="currency.id"
                role="option"
                :aria-selected="currency.code === selectedCurrency?.code"
              >
                <button
                  type="button"
                  class="payment-calc__currency-option"
                  :class="{ 'payment-calc__currency-option--active': currency.code === selectedCurrency?.code }"
                  @click="selectCurrency(currency)"
                >
                  <img
                    :src="currency.flag"
                    :alt="currency.code"
                    class="payment-calc__flag"
                    width="21"
                    height="21"
                  />
                  <span>{{ currency.code }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </label>

      <label class="payment-calc__field">
        <span class="payment-calc__label">Телефон</span>
        <input
          :value="phone"
          type="tel"
          maxlength="18"
          inputmode="numeric"
          class="payment-calc__input payment-calc__input--phone"
          placeholder="+7 (999) 999 99 99"
          @keydown="onPhoneKeydown"
          @input="onPhoneInput"
        />
      </label>

      <button
        type="submit"
        class="app-btn payment-calc__btn"
        :disabled="!canSubmit || isSubmitting"
      >
        {{ isSubmitting ? 'Отправка...' : 'Рассчитать' }}
      </button>

      <p class="payment-calc__note">
        Нажимая на кнопку «Рассчитать»<br />
        Вы соглашаетесь на обработку персональных данных и получение рекламных материалов
      </p>
    </form>
  </div>
</template>

<script setup>
import { getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const amount = ref('')
const phone = ref('+7 ')
const isCurrencyOpen = ref(false)
const currencyRef = ref(null)
const selectedCurrency = ref(null)
const { isSubmitting, submit } = useFormSubmit()

const { data: additionalDataResponse } = await useFetch(
  `${urlApi}/api/additional-data?populate[home_hero_form_data][populate]=flag`,
)

const currencies = computed(() => {
  const items = additionalDataResponse.value?.data?.home_hero_form_data ?? []

  return items
    .map((item) => ({
      id: item.id,
      code: item.title?.trim() || '',
      symbol: item.symbol?.trim() || '',
      flag: getStrapiMediaUrl(item.flag, urlApi),
    }))
    .filter((item) => item.code && item.flag)
})

watch(
  currencies,
  (list) => {
    if (!list.length) {
      selectedCurrency.value = null
      return
    }

    const hasCurrent = list.some((item) => item.code === selectedCurrency.value?.code)

    if (!selectedCurrency.value || !hasCurrent) {
      selectedCurrency.value = list[0]
    }
  },
  { immediate: true },
)

const canSubmit = computed(
  () =>
    amount.value.trim()
    && phone.value.replace(/\D/g, '').length === 11
    && Boolean(selectedCurrency.value?.code),
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

  const success = await submit('/api/forms/payment-calc', {
    title_form: 'Рассчитайте платеж',
    amount: amount.value.trim(),
    phone: phone.value.trim(),
    currency: selectedCurrency.value?.code || '',
  }, {
    yandexGoal: 'calc_form',
    validate: () => canSubmit.value,
  })

  if (!success) return

  amount.value = ''
  phone.value = '+7 '
  selectedCurrency.value = currencies.value[0] ?? null
}

function toggleCurrency() {
  isCurrencyOpen.value = !isCurrencyOpen.value
}

function selectCurrency(currency) {
  selectedCurrency.value = currency
  isCurrencyOpen.value = false
}

function handleClickOutside(event) {
  if (!currencyRef.value?.contains(event.target)) {
    isCurrencyOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

