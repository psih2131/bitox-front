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

  <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
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
      <span class="exchange-calc-sec__label">Город</span>
      <div class="exchange-calc-sec__select-wrap">
        <select v-model="selectedCity" class="exchange-calc-sec__select">
          <option
            v-for="city in cityOptions"
            :key="city"
            :value="city"
          >
            {{ city }}
          </option>
        </select>
      </div>
    </label>
  </div>

  <label class="exchange-calc-sec__field">
    <span class="exchange-calc-sec__label">Сумма</span>
    <div class="exchange-calc-sec__input-wrap">
      <input
        v-model="amount"
        type="text"
        inputmode="decimal"
        class="exchange-calc-sec__input"
      />
    </div>
  </label>

  <Teleport defer to="#exchange-calc-sidebar">
    <div class="exchange-calc-sec__info-box">
      <p class="exchange-calc-sec__info-title">Курс наличного обмена</p>
      <p class="exchange-calc-sec__info-text">
        Курс зависит от города, объёма и времени сделки. Точную сумму
        получения менеджер сообщит в Telegram.
      </p>
    </div>

    <div class="exchange-calc-sec__params">
      <p class="exchange-calc-sec__params-title">Параметры заявки</p>

      <div class="exchange-calc-sec__params-row">
        <span>Отдаете</span>
        <strong>{{ giveDisplay }} {{ fromLabel }}</strong>
      </div>
      <div class="exchange-calc-sec__params-row">
        <span>Получаете</span>
        <strong>≈ {{ receiveDisplay }} {{ toLabel }}</strong>
      </div>
      <div class="exchange-calc-sec__params-row">
        <span>Локация</span>
        <strong>{{ locationDisplay }}</strong>
      </div>
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
import {
  getCityOptions,
  resolveCityCode,
  syncRefSelect,
} from './location-utils'

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
const selectedCity = ref('')
const amount = ref('100000')

const fromOptions = computed(() => buildUniqueFromOptions(props.items))
const toOptions = computed(() => buildUniqueToOptions(props.items, selectedFrom.value))
const cityOptions = computed(() => getCityOptions(props.countries, selectedCountry.value))

const selectedRate = computed(() =>
  findRate(
    props.items,
    selectedFrom.value,
    selectedTo.value,
    resolveCityCode(selectedCity.value),
  ),
)

const giveAmount = computed(() => parseAmount(amount.value))
const receiveAmount = computed(() => calcReceiveAmount(giveAmount.value, selectedRate.value))

const fromLabel = computed(() => selectedRate.value?.nameRuFrom || '—')
const toLabel = computed(() => selectedRate.value?.nameRuTo || '—')
const giveDisplay = computed(() => formatAmount(giveAmount.value, 2))
const receiveDisplay = computed(() => formatAmount(receiveAmount.value, 2))
const locationDisplay = computed(() => {
  const parts = [selectedCountry.value, selectedCity.value].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

watch(
  () => props.countries,
  (list) => {
    syncRefSelect(selectedCountry, list, (item) => item.name_country)
  },
  { immediate: true },
)

watch(cityOptions, (options) => {
  syncRefSelect(selectedCity, options)
}, { immediate: true })

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
