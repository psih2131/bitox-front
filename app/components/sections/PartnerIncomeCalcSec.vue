<template>
  <section ref="sectionRef" class="partner-calc-sec">
    <div class="container">
      <h2 class="partner-calc-sec__title">Калькулятор дохода</h2>

      <div class="partner-calc-sec__card">
        <form class="partner-calc-sec__form" @submit.prevent>
          <label class="partner-calc-sec__field">
            <span class="partner-calc-sec__label">Сумма сделки</span>

            <div class="partner-calc-sec__input-wrap">
              <input
                v-model="amountDisplay"
                type="text"
                class="partner-calc-sec__input"
                inputmode="numeric"
                @input="onAmountInput"
              />

              <div ref="currencyRef" class="partner-calc-sec__currency-wrap">
                <button
                  type="button"
                  class="partner-calc-sec__currency"
                  :class="{ 'partner-calc-sec__currency--open': isCurrencyOpen }"
                  :aria-expanded="isCurrencyOpen"
                  aria-haspopup="listbox"
                  @click="toggleCurrency"
                >
                  <img
                    :src="selectedCurrency.flag"
                    :alt="selectedCurrency.code"
                    class="partner-calc-sec__flag"
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
                  class="partner-calc-sec__currency-list"
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
                      class="partner-calc-sec__currency-option"
                      :class="{ 'partner-calc-sec__currency-option--active': currency.code === selectedCurrency.code }"
                      @click="selectCurrency(currency)"
                    >
                      <img
                        :src="currency.flag"
                        :alt="currency.code"
                        class="partner-calc-sec__flag"
                        width="21"
                        height="21"
                      />
                      <span>{{ currency.code }}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <input
              v-model.number="amount"
              type="range"
              class="partner-calc-sec__range"
              min="10000"
              max="1000000"
              step="10000"
              aria-label="Сумма сделки"
              :style="{ '--range-progress': `${amountProgress}%` }"
              @input="syncAmountDisplay"
            />
          </label>

          <label class="partner-calc-sec__field">
            <span class="partner-calc-sec__label">Комиссия от сделки</span>

            <div class="partner-calc-sec__input-wrap partner-calc-sec__input-wrap--commission">
              <input
                v-model="commissionDisplay"
                type="text"
                class="partner-calc-sec__input"
                inputmode="decimal"
                @input="onCommissionInput"
              />
              <span class="partner-calc-sec__suffix">%</span>
            </div>

            <input
              v-model.number="commission"
              type="range"
              class="partner-calc-sec__range"
              min="0.5"
              max="10"
              step="0.1"
              aria-label="Комиссия от сделки"
              :style="{ '--range-progress': `${commissionProgress}%` }"
              @input="syncCommissionDisplay"
            />
          </label>

          <div class="partner-calc-sec__result-box partner-calc-sec__result-box--mob">
            <p class="partner-calc-sec__result-value">{{ formattedIncome }}</p>
            <p class="partner-calc-sec__result-label">Доход от сделки</p>
          </div>

          <div class="partner-calc-sec__actions">
            <button type="submit" class="app-btn partner-calc-sec__btn">Рассчитать</button>

            <p class="partner-calc-sec__note">
              Приведены ориентировочные значения. Итоговый размер дохода зависит от направления
              сделки, валюты, суммы перевода и тарифного плана.
            </p>
          </div>
        </form>

        <div class="partner-calc-sec__result">
          <div class="partner-calc-sec__result-box">
            <p class="partner-calc-sec__result-value">{{ formattedIncome }}</p>
            <p class="partner-calc-sec__result-label">Доход от сделки</p>
          </div>

          <img
            :src="cardsImage"
            alt=""
            class="partner-calc-sec__decor-cards"
            width="198"
            height="151"
          />
          <img :src="coin1" alt="" class="partner-calc-sec__decor-coin partner-calc-sec__decor-coin--1" />
          <img :src="coin2" alt="" class="partner-calc-sec__decor-coin partner-calc-sec__decor-coin--2" />
          
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import flagUsd from '~/assets/images/flags/x4.jpg'
import flagEur from '~/assets/images/flags/x1.jpg'
import flagGbp from '~/assets/images/flags/x2.jpg'
import cardsImage from '~/assets/images/gr-5.png'
import coin1 from '~/assets/images/coin-1.png'
import coin2 from '~/assets/images/coin-2.png'
import coin3 from '~/assets/images/coin-3.png'

const sectionRef = ref(null)
const currencyRef = ref(null)
const isCurrencyOpen = ref(false)

const amount = ref(100000)
const commission = ref(1.5)

const amountDisplay = ref('')
const commissionDisplay = ref('')

const currencies = [
  { code: 'USD', symbol: '$', flag: flagUsd },
  { code: 'EUR', symbol: '€', flag: flagEur },
  { code: 'GBP', symbol: '£', flag: flagGbp },
]

const selectedCurrency = ref(currencies[0])

const income = computed(() => amount.value * (commission.value / 100))

const formattedIncome = computed(() => {
  const formatted = new Intl.NumberFormat('ru-RU').format(Math.round(income.value))
  return `${selectedCurrency.value.symbol} ${formatted}`
})

const amountProgress = computed(() => {
  return ((amount.value - 10000) / (1000000 - 10000)) * 100
})

const commissionProgress = computed(() => {
  return ((commission.value - 0.5) / (10 - 0.5)) * 100
})

function formatAmount(value) {
  return new Intl.NumberFormat('ru-RU').format(value)
}

function formatCommission(value) {
  return String(value).replace('.', ',')
}

function parseAmount(value) {
  const digits = value.replace(/\s/g, '').replace(/[^\d]/g, '')
  return digits ? Number(digits) : 0
}

function parseCommission(value) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '')
  return normalized ? Number(normalized) : 0
}

function syncAmountDisplay() {
  amountDisplay.value = formatAmount(amount.value)
}

function syncCommissionDisplay() {
  commissionDisplay.value = formatCommission(commission.value)
}

function onAmountInput(event) {
  const value = parseAmount(event.target.value)
  amount.value = Math.min(1000000, Math.max(10000, value || 10000))
  syncAmountDisplay()
}

function onCommissionInput(event) {
  const value = parseCommission(event.target.value)
  commission.value = Math.min(10, Math.max(0.5, value || 0.5))
  syncCommissionDisplay()
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

let sectionAnimation

onMounted(() => {
  syncAmountDisplay()
  syncCommissionDisplay()

  document.addEventListener('click', handleClickOutside)

  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.partner-calc-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.partner-calc-sec__card', {
      opacity: 0,
      y: 32,
      duration: 0.7,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  sectionAnimation?.revert()
})
</script>
