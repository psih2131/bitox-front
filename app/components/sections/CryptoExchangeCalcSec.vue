<template>
  <section ref="sectionRef" class="exchange-calc-sec">
    <div class="container">
      <div class="exchange-calc-sec__layout">
        <div class="exchange-calc-sec__form-card">
          <h2 class="exchange-calc-sec__title"  v-if="countryName">Калькулятор перевода в {{ countryName }}</h2>
          <h2 class="exchange-calc-sec__title"  v-else>Калькулятор перевода</h2>

          <div class="exchange-calc-sec__tabs" role="tablist" aria-label="Тип заявки">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="exchange-calc-sec__tab"
              :class="{ 'exchange-calc-sec__tab--active': activeTab === tab.id }"
              role="tab"
              :aria-selected="activeTab === tab.id"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <form class="exchange-calc-sec__form" @submit.prevent>
            <template v-if="activeTab === 'cashless'">
              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Отдаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cashless.give" class="exchange-calc-sec__select">
                      <option
                        v-for="option in cashlessGiveOptions"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Получаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cashless.receive" class="exchange-calc-sec__select">
                      <option
                        v-for="option in cashlessReceiveOptions"
                        :key="option.title"
                        :value="option.title"
                      >
                        {{ option.title }}
                      </option>
                    </select>
                  </div>
                </label>
              </div>

              <label class="exchange-calc-sec__field">
                <span class="exchange-calc-sec__label">Страна</span>
                <div class="exchange-calc-sec__select-wrap">
                  <select v-model="cashless.country" class="exchange-calc-sec__select">
                    <option
                      v-for="country in cashlessCountries"
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
                    :value="cashless.amount"
                    type="text"
                    class="exchange-calc-sec__input"
                    inputmode="numeric"
                    @keydown="onDigitsKeydown"
                    @input="onAmountInput($event, cashless, 'amount')"
                  />
                  <span class="exchange-calc-sec__suffix">₽</span>
                </div>
              </label>
            </template>

            <template v-else-if="activeTab === 'cash'">
              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Отдаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.give" class="exchange-calc-sec__select">
                      <option
                        v-for="option in cashGiveOptions"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Получаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.receive" class="exchange-calc-sec__select">
                      <option
                        v-for="option in cashReceiveOptions"
                        :key="option.title"
                        :value="option.title"
                      >
                        {{ option.title }}
                      </option>
                    </select>
                  </div>
                </label>
              </div>

              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Страна</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.country" class="exchange-calc-sec__select">
                      <option
                        v-for="country in cashCountries"
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
                    <select v-model="cash.city" class="exchange-calc-sec__select">
                      <option
                        v-for="city in cashCityOptions"
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
                    :value="cash.amount"
                    type="text"
                    class="exchange-calc-sec__input"
                    inputmode="numeric"
                    @keydown="onDigitsKeydown"
                    @input="onAmountInput($event, cash, 'amount')"
                  />
                </div>
              </label>
            </template>

            <template v-else>
              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Страна</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="invoice.country" class="exchange-calc-sec__select">
                      <option
                        v-for="country in invoiceCountries"
                        :key="country.id"
                        :value="country.title"
                      >
                        {{ country.title }}
                      </option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Валюта</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="invoice.currencyId" class="exchange-calc-sec__select">
                      <option
                        v-for="currency in invoiceCurrencies"
                        :key="currency.id"
                        :value="getInvoiceCurrencyValue(currency)"
                      >
                        {{ currency.name_money }}
                      </option>
                    </select>
                  </div>
                </label>
              </div>

              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Сумма</span>
                  <div class="exchange-calc-sec__input-wrap">
                    <input
                      :value="invoice.amount"
                      type="text"
                      class="exchange-calc-sec__input"
                      inputmode="numeric"
                      @keydown="onDigitsKeydown"
                      @input="onAmountInput($event, invoice, 'amount')"
                    />
                    <span class="exchange-calc-sec__suffix">{{ selectedInvoiceCurrency?.symbol || '¥' }}</span>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">За что оплата</span>
                  <div class="exchange-calc-sec__input-wrap">
                    <input
                      v-model="invoice.purpose"
                      type="text"
                      maxlength="25"
                      class="exchange-calc-sec__input"
                    />
                  </div>
                </label>
              </div>

              <label class="exchange-calc-sec__field">
                <span class="exchange-calc-sec__label">Комментарий</span>
                <div class="exchange-calc-sec__textarea-wrap">
                  <textarea
                    v-model="invoice.comment"
                    class="exchange-calc-sec__textarea"
                    rows="4"
                    placeholder="Дополнительная информация по инвойсу"
                  />
                </div>
              </label>
            </template>
          </form>
        </div>

        <aside class="exchange-calc-sec__sidebar">
          <h3 class="exchange-calc-sec__sidebar-title">Результат</h3>

          <template v-if="activeTab === 'cashless'">
            <div class="exchange-calc-sec__result-block">
              <p class="exchange-calc-sec__result-label">Отдаете</p>
              <p class="exchange-calc-sec__result-value">
                {{ formatCalcNumber(Number(cashless.amount) || 0) }} ₽
              </p>
              <p class="exchange-calc-sec__result-note">{{ cashless.give }}</p>
            </div>

            <div class="exchange-calc-sec__result-block">
              <p class="exchange-calc-sec__result-label">Коэффициент</p>
              <p class="exchange-calc-sec__result-value">
                × {{ formatCalcNumber(cashlessSelectedReceive?.price || 0) }}
              </p>
              <p class="exchange-calc-sec__result-note">Зафиксирован на 15 мин</p>
            </div>

            <div class="exchange-calc-sec__result-block exchange-calc-sec__result-block--accent">
              <p class="exchange-calc-sec__result-label">Получаете</p>
              <p class="exchange-calc-sec__result-value">
                ≈ {{ formatCalcNumber(cashlessResult) }}
              </p>
              <p class="exchange-calc-sec__result-note">{{ cashless.receive }}</p>
            </div>
          </template>

          <template v-else-if="activeTab === 'cash'">
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
                <strong>{{ formatCalcNumber(Number(cash.amount) || 0) }} {{ cash.give }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Получаете</span>
                <strong>{{ cash.receive }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Локация</span>
                <strong>{{ cash.country }}, {{ cash.city }}</strong>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="exchange-calc-sec__info-box">
              <p class="exchange-calc-sec__info-title">Оплата инвойса по запросу</p>
              <p class="exchange-calc-sec__info-text">
                Менеджер проверит инвойс, рассчитает курс и согласует детали
                в Telegram.
              </p>
            </div>

            <div class="exchange-calc-sec__params">
              <p class="exchange-calc-sec__params-title">Данные инвойса</p>

              <div class="exchange-calc-sec__params-row">
                <span>Страна</span>
                <strong>{{ invoice.country }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Валюта</span>
                <strong>
                  {{ selectedInvoiceCurrency?.name_money }}
                  <template v-if="selectedInvoiceCurrency?.symbol">
                    {{ selectedInvoiceCurrency.symbol }}
                  </template>
                </strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Сумма</span>
                <strong>{{ invoice.amount }} {{ selectedInvoiceCurrency?.symbol || '¥' }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>За что</span>
                <strong>{{ invoice.purpose }}</strong>
              </div>
            </div>
          </template>

          <p
            v-if="activeTab === 'cashless'"
            class="exchange-calc-sec__sidebar-text"
          >
            Перейдите в Telegram, чтобы оформить заявку
          </p>

          <AppClientBtn class="exchange-calc-sec__sidebar-btn" @click="openConsultationModal">
            Перейти к заявке в Telegram
          </AppClientBtn>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const props = defineProps({
  countryName: {
    type: String,
    required: true,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl
const sectionRef = ref(null)
const modalStore = useModalStore()

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

const tabs = [
  { id: 'cashless', label: 'Безналичный' },
  { id: 'cash', label: 'Наличный' },
  { id: 'invoice', label: 'Оплата инвойсов' },
]

const activeTab = ref('cashless')

const calcPopulate = [
  'populate[calc][populate][exchange_data][populate][without_cache][populate][exchange_list][populate]=what_you_get',
  'populate[calc][populate][exchange_data][populate][cache][populate][exchange_list][populate]=what_you_get',
  'populate[calc][populate][exchange_data][populate][cache][populate][citys]=true',
  'populate[calc][populate][exchange_data][populate][invoices][populate][states_list]=true',
  'populate[calc][populate][exchange_data][populate][invoices][populate][money_type_lists]=true',
].join('&')

const { data: calcResponse } = await useFetch(
  `${urlApi}/api/exchange-calc-component?${calcPopulate}`,
)

function sortByLabel(items, getLabel = (item) => item) {
  return [...items].sort((a, b) =>
    String(getLabel(a)).localeCompare(String(getLabel(b)), 'ru', { sensitivity: 'base' }),
  )
}

const calcData = computed(() => calcResponse.value?.data?.calc?.exchange_data)
const cashlessCountries = computed(() =>
  sortByLabel(calcData.value?.without_cache ?? [], (item) => item.name_country),
)
const cashCountries = computed(() =>
  sortByLabel(calcData.value?.cache ?? [], (item) => item.name_country),
)
const invoiceData = computed(() => calcData.value?.invoices ?? null)
const invoiceCountries = computed(() =>
  sortByLabel(invoiceData.value?.states_list ?? [], (item) => item.title),
)
const invoiceCurrencies = computed(() =>
  sortByLabel(invoiceData.value?.money_type_lists ?? [], (item) => item.name_money),
)

const cashless = reactive({
  country: '',
  give: '',
  receive: '',
  amount: '100',
})

const cash = reactive({
  country: '',
  give: '',
  receive: '',
  city: '',
  amount: '100',
})

const invoice = reactive({
  country: '',
  currencyId: '',
  amount: '120000',
  purpose: '',
  comment: '',
})

function getInvoiceCurrencyValue(currency) {
  return currency.id ?? currency.name_money
}

const selectedInvoiceCurrency = computed(() =>
  invoiceCurrencies.value.find(
    (item) => getInvoiceCurrencyValue(item) === invoice.currencyId,
  ),
)

function getCountryByName(countries, name) {
  return countries.find((item) => item.name_country === name)
}

function getGiveOptions(countries, countryName) {
  const country = getCountryByName(countries, countryName)
  if (!country?.exchange_list?.length) return []

  return sortByLabel(
    country.exchange_list
      .map((pair) => pair.what_you_give)
      .filter(Boolean),
  )
}

function getReceiveOptions(countries, countryName, giveValue) {
  const country = getCountryByName(countries, countryName)
  const pair = country?.exchange_list?.find((item) => item.what_you_give === giveValue)

  return sortByLabel(
    (pair?.what_you_get ?? [])
      .filter((item) => item?.title)
      .map((item) => ({
        title: item.title,
        price: Number(item.price) || 0,
      })),
    (item) => item.title,
  )
}

function getCityOptions(countries, countryName) {
  const country = getCountryByName(countries, countryName)
  if (!country?.citys?.length) return []

  return sortByLabel(
    country.citys
      .map((item) => item.city_name)
      .filter(Boolean),
  )
}

function syncSelectValue(model, field, options, getValue = (item) => item) {
  const values = options.map(getValue)

  if (!values.length) {
    model[field] = ''
    return
  }

  if (!values.includes(model[field])) {
    model[field] = values[0]
  }
}

const cashlessGiveOptions = computed(() =>
  getGiveOptions(cashlessCountries.value, cashless.country),
)

const cashlessReceiveOptions = computed(() =>
  getReceiveOptions(cashlessCountries.value, cashless.country, cashless.give),
)

const cashGiveOptions = computed(() =>
  getGiveOptions(cashCountries.value, cash.country),
)

const cashReceiveOptions = computed(() =>
  getReceiveOptions(cashCountries.value, cash.country, cash.give),
)

const cashCityOptions = computed(() =>
  getCityOptions(cashCountries.value, cash.country),
)

const cashlessSelectedReceive = computed(() =>
  cashlessReceiveOptions.value.find((item) => item.title === cashless.receive),
)

const cashlessResult = computed(() => {
  const amount = Number(cashless.amount) || 0
  const price = cashlessSelectedReceive.value?.price || 0

  return amount * price
})

function formatCalcNumber(value) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: value > 0 && value < 1 ? 6 : 2,
  }).format(value)
}

const MAX_AMOUNT_DIGITS = 14

function digitsOnly(value) {
  return String(value).replace(/\D/g, '')
}

function onDigitsKeydown(event) {
  const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowed.includes(event.key) || event.ctrlKey || event.metaKey) return
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
    return
  }

  const input = event.target
  const hasSelection = input.selectionStart !== input.selectionEnd
  if (!hasSelection && digitsOnly(input.value).length >= MAX_AMOUNT_DIGITS) {
    event.preventDefault()
  }
}

function onAmountInput(event, model, field) {
  const value = digitsOnly(event.target.value).slice(0, MAX_AMOUNT_DIGITS)
  model[field] = value
  event.target.value = value
}

watch(cashlessCountries, (countries) => {
  syncSelectValue(cashless, 'country', countries, (item) => item.name_country)
}, { immediate: true })

watch(() => cashless.country, () => {
  syncSelectValue(cashless, 'give', cashlessGiveOptions.value)
}, { immediate: true })

watch(() => [cashless.country, cashless.give], () => {
  syncSelectValue(cashless, 'receive', cashlessReceiveOptions.value, (item) => item.title)
}, { immediate: true })

watch(cashCountries, (countries) => {
  syncSelectValue(cash, 'country', countries, (item) => item.name_country)
}, { immediate: true })

watch(() => cash.country, () => {
  syncSelectValue(cash, 'give', cashGiveOptions.value)
}, { immediate: true })

watch(() => cash.country, () => {
  syncSelectValue(cash, 'city', cashCityOptions.value)
}, { immediate: true })

watch(() => [cash.country, cash.give], () => {
  syncSelectValue(cash, 'receive', cashReceiveOptions.value, (item) => item.title)
}, { immediate: true })

watch(invoiceCountries, (list) => {
  syncSelectValue(invoice, 'country', list, (item) => item.title)
}, { immediate: true })

watch(invoiceCurrencies, (list) => {
  syncSelectValue(invoice, 'currencyId', list, (item) => getInvoiceCurrencyValue(item))
}, { immediate: true })

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.exchange-calc-sec__layout', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
