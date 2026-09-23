<template>
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
          @input="onAmountInput"
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

  <Teleport defer to="#exchange-calc-sidebar">
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
  </Teleport>
</template>

<script setup>
const props = defineProps({
  defaultAmount: {
    type: String,
    default: '100000',
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const calcPopulate = [
  'populate[calc][populate][exchange_data][populate][invoices][populate][states_list]=true',
  'populate[calc][populate][exchange_data][populate][invoices][populate][money_type_lists]=true',
].join('&')

const { data: calcResponse } = useFetch(
  `${urlApi}/api/exchange-calc-component?${calcPopulate}`,
)

function sortByLabel(items, getLabel = (item) => item) {
  return [...items].sort((a, b) =>
    String(getLabel(a)).localeCompare(String(getLabel(b)), 'ru', { sensitivity: 'base' }),
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

function getInvoiceCurrencyValue(currency) {
  return currency.id ?? currency.name_money
}

const invoiceData = computed(() => calcResponse.value?.data?.calc?.exchange_data?.invoices ?? null)
const invoiceCountries = computed(() =>
  sortByLabel(invoiceData.value?.states_list ?? [], (item) => item.title),
)
const invoiceCurrencies = computed(() =>
  sortByLabel(invoiceData.value?.money_type_lists ?? [], (item) => item.name_money),
)

const invoice = reactive({
  country: '',
  currencyId: '',
  amount: props.defaultAmount || '100000',
  purpose: '',
  comment: '',
})

const selectedInvoiceCurrency = computed(() =>
  invoiceCurrencies.value.find(
    (item) => getInvoiceCurrencyValue(item) === invoice.currencyId,
  ),
)

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

function onAmountInput(event) {
  const value = digitsOnly(event.target.value).slice(0, MAX_AMOUNT_DIGITS)
  invoice.amount = value
  event.target.value = value
}

watch(invoiceCountries, (list) => {
  syncSelectValue(invoice, 'country', list, (item) => item.title)
}, { immediate: true })

watch(invoiceCurrencies, (list) => {
  syncSelectValue(invoice, 'currencyId', list, (item) => getInvoiceCurrencyValue(item))
}, { immediate: true })
</script>
