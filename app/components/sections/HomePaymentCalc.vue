<template>
  <div class="payment-calc">
    <h2 class="payment-calc__title">Рассчитайте платеж</h2>

    <form class="payment-calc__form" @submit.prevent="handleSubmit">
      <label class="payment-calc__field">
        <span class="payment-calc__label">Сумма</span>
        <div class="payment-calc__input-wrap">
          <span class="payment-calc__currency-symbol">{{ selectedCurrency.symbol }}</span>
          <input
            v-model="amount"
            type="text"
            class="payment-calc__input"
            placeholder=""
          />

          <div ref="currencyRef" class="payment-calc__currency-wrap">
            <button
              type="button"
              class="payment-calc__currency"
              :class="{ 'payment-calc__currency--open': isCurrencyOpen }"
              :aria-expanded="isCurrencyOpen"
              aria-haspopup="listbox"
              @click="toggleCurrency"
            >
              <img
                :src="selectedCurrency.flag"
                :alt="selectedCurrency.code"
                class="payment-calc__flag"
                width="21"
                height="21"
              />
              <span>{{ selectedCurrency.code }}</span>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M4.5 0.5L8.5 8.5H0.5L4.5 0.5Z" fill="#606061" />
              </svg>
            </button>

            <ul
              v-if="isCurrencyOpen"
              class="payment-calc__currency-list"
              role="listbox"
              :aria-label="`Валюта, выбрано ${selectedCurrency.code}`"
            >
              <li
                v-for="currency in currencies"
                :key="currency.code"
                role="option"
                :aria-selected="currency.code === selectedCurrency.code"
              >
                <button
                  type="button"
                  class="payment-calc__currency-option"
                  :class="{ 'payment-calc__currency-option--active': currency.code === selectedCurrency.code }"
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
          v-model="phone"
          type="tel"
          class="payment-calc__input payment-calc__input--phone"
          placeholder="+7 (999) 999 99 99"
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
import flagUsd from '~/assets/images/flags/x4.jpg'
import flagEur from '~/assets/images/flags/x1.jpg'
import flagGbp from '~/assets/images/flags/x2.jpg'
import flagTry from '~/assets/images/flags/x3.jpg'
import flagCad from '~/assets/images/flags/x5.jpg'
import flagCny from '~/assets/images/flags/x6.jpg'

const amount = ref('')
const phone = ref('')
const isCurrencyOpen = ref(false)
const currencyRef = ref(null)
const { isSubmitting, submit } = useFormSubmit()

const currencies = [
  { code: 'USD', symbol: '$', flag: flagUsd },
  { code: 'EUR', symbol: '€', flag: flagEur },
  { code: 'GBP', symbol: '£', flag: flagGbp },
  { code: 'TRY', symbol: '₺', flag: flagTry },
  { code: 'CAD', symbol: 'C$', flag: flagCad },
  { code: 'CNY', symbol: '¥', flag: flagCny },
]

const selectedCurrency = ref(currencies[0])

const canSubmit = computed(
  () => amount.value.trim() && phone.value.trim(),
)

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return

  const success = await submit('/api/forms/payment-calc', {
    amount: amount.value.trim(),
    phone: phone.value.trim(),
    currency: selectedCurrency.value.code,
  })

  if (!success) return

  amount.value = ''
  phone.value = ''
  selectedCurrency.value = currencies[0]
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

