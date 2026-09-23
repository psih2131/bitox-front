<template>
  <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
    <label class="exchange-calc-sec__field">
      <span class="exchange-calc-sec__label">Отдаете</span>
      <div class="exchange-calc-sec__select-wrap">
        <select v-model="selectedFrom" class="exchange-calc-sec__select">
          <option
            v-for="item in fromOptions"
            :key="item.from"
            :value="item.from"
          >
            {{ item.nameRuFrom }}
          </option>
        </select>
      </div>
    </label>

    <label class="exchange-calc-sec__field">
      <span class="exchange-calc-sec__label">Получаете</span>
      <div class="exchange-calc-sec__select-wrap">
        <select v-model="selectedTo" class="exchange-calc-sec__select">
          <option
            v-for="item in toOptions"
            :key="item.to"
            :value="item.to"
          >
            {{ item.nameRuTo }}
          </option>
        </select>
      </div>
    </label>
  </div>

  <label class="exchange-calc-sec__field">
    <span class="exchange-calc-sec__label">Страна</span>
    <div class="exchange-calc-sec__select-wrap">
      <select v-model="selectedCountry" class="exchange-calc-sec__select">
        <option
          v-for="country in countries"
          :key="country.id"
          :value="country.name_country"
        >
          {{ country.name_country }}
        </option>
      </select>
    </div>
  </label>

  <label class="exchange-calc-sec__field">
    <span class="exchange-calc-sec__label">Сумма</span>
    <div class="exchange-calc-sec__input-wrap">
      <input
        v-model="amount"
        type="text"
        inputmode="decimal"
        class="exchange-calc-sec__input"
      />
      <span class="exchange-calc-sec__suffix">₽</span>
    </div>
  </label>

  <Teleport defer to="#exchange-calc-sidebar">
    <div class="exchange-calc-sec__result-block">
      <p class="exchange-calc-sec__result-label">Отдаете</p>
      <p class="exchange-calc-sec__result-value">{{ giveDisplay }}</p>
      <p class="exchange-calc-sec__result-note">{{ fromLabel }}</p>
    </div>

    <div class="exchange-calc-sec__result-block">
      <p class="exchange-calc-sec__result-label">Коэффициент</p>
      <p class="exchange-calc-sec__result-value">× {{ coefDisplay }}</p>
      <p class="exchange-calc-sec__result-note">Зафиксирован на 15 мин</p>
    </div>

    <div class="exchange-calc-sec__result-block exchange-calc-sec__result-block--accent">
      <p class="exchange-calc-sec__result-label">Получаете</p>
      <p class="exchange-calc-sec__result-value">≈ {{ receiveDisplay }}</p>
      <p class="exchange-calc-sec__result-note">{{ toLabel }}</p>
    </div>
  </Teleport>
</template>

<script setup>
import {
  buildUniqueFromOptions,
  buildUniqueToOptions,
  calcReceiveAmount,
  findRate,
  formatAmount,
  parseAmount,
} from './rate-utils'
import { syncRefSelect } from './location-utils'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  countries: {
    type: Array,
    default: () => [],
  },
})

const selectedFrom = ref('')
const selectedTo = ref('')
const selectedCountry = ref('')
const amount = ref('100000')

const fromOptions = computed(() => buildUniqueFromOptions(props.items))
const toOptions = computed(() => buildUniqueToOptions(props.items, selectedFrom.value))
const selectedRate = computed(() =>
  findRate(props.items, selectedFrom.value, selectedTo.value),
)

const giveAmount = computed(() => parseAmount(amount.value))
const receiveAmount = computed(() => calcReceiveAmount(giveAmount.value, selectedRate.value))

const coef = computed(() => {
  const rate = selectedRate.value
  if (!rate) return 0

  const rateIn = Number(rate.in)
  const rateOut = Number(rate.out)
  if (!rateIn || !Number.isFinite(rateIn) || !Number.isFinite(rateOut)) return 0

  return rateOut / rateIn
})

const fromLabel = computed(() => selectedRate.value?.nameRuFrom || '—')
const toLabel = computed(() => selectedRate.value?.nameRuTo || '—')
const giveDisplay = computed(() => formatAmount(giveAmount.value, 2))
const receiveDisplay = computed(() => formatAmount(receiveAmount.value, 2))
const coefDisplay = computed(() => formatAmount(coef.value, 2))

watch(
  () => props.countries,
  (list) => {
    syncRefSelect(selectedCountry, list, (item) => item.name_country)
  },
  { immediate: true },
)

watch(fromOptions, (options) => {
  if (!options.length) {
    selectedFrom.value = ''
    return
  }

  const stillExists = options.some((item) => item.from === selectedFrom.value)
  if (!stillExists) selectedFrom.value = options[0].from
}, { immediate: true })

watch(toOptions, (options) => {
  if (!options.length) {
    selectedTo.value = ''
    return
  }

  const stillExists = options.some((item) => item.to === selectedTo.value)
  if (!stillExists) selectedTo.value = options[0].to
}, { immediate: true })

watch(selectedRate, (rate) => {
  if (!rate) return
  if (amount.value) return

  const minAmount = Number(rate.minamount)
  if (Number.isFinite(minAmount) && minAmount > 0) {
    amount.value = String(Math.round(minAmount))
  }
})
</script>
