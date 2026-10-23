<template>
  <section class="transfer-features-sec">
    <div class="container">
      <h2 class="transfer-features-sec__title">
        {{ titleResolved }}
      </h2>

      <div class="transfer-features-sec__grid">
        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual">
            <div class="transfer-features-sec__pills">
              <span v-for="(pill, index) in bankPills" :key="index" class="transfer-features-sec__pill">
                <span v-if="pill.arrow" class="transfer-features-sec__pill-arrow">{{ pill.arrow }}</span> {{ pill.label }}
              </span>
            </div>
          </div>

          <p class="transfer-features-sec__text">
            {{ banksTextResolved }}
          </p>
        </article>

        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual transfer-features-sec__visual--image">
            <img
              :src="walletImage"
              alt=""
              class="transfer-features-sec__image"
            >
          </div>

          <p class="transfer-features-sec__text">
            {{ walletTextResolved }}
          </p>
        </article>

        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual">
            <div class="transfer-features-sec__pills">
              <span v-for="(amount, index) in amountPills" :key="index" class="transfer-features-sec__pill">{{ amount }}</span>
            </div>
          </div>

          <p class="transfer-features-sec__text">
            {{ paymentsTextResolved }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import walletImage from '~/assets/images/gr-19.png'
import { getCountryPrepositional } from '~/utils/getCountryPrepositional'

const props = defineProps({
  countryName: {
    type: String,
    default: null,
  },
  countryCities: {
    type: Array,
    default: () => [],
  },
  // Блок transfer_features_sec из админки (страница перевода).
  // Любое пустое поле — показываем общий текст
  section: {
    type: Object,
    default: null,
  },
})

// Общие значения, если у страны поля в админке не заполнены
const DEFAULT_BANKS = ['WISE', 'Revolut', 'BBVA', 'N26', '+99']
const DEFAULT_AMOUNTS = ['-6 789 USD', '-3 499 EUR', '-10 099 EUR', '-54 795 USD']

// Метки страны в текстах (в админке): «в {{куда}}» → «в Китай», «в {{где}}» → «в Китае»,
// «из {{откуда}}» → «из Китая», {{кому}}, {{чем}}, {{что}} — остальные падежи
const COUNTRY_CASES = { '': 'accusative', 'куда': 'accusative', 'где': 'prepositional', 'откуда': 'genitive', 'кому': 'dative', 'чем': 'instrumental', 'что': 'nominative' }
const FALLBACK = { accusative: 'страну', prepositional: 'стране', genitive: 'страны', dative: 'стране', instrumental: 'страной', nominative: 'страна' }

function replaceCountryPlaceholder(text) {
  return text.replace(/\{\{\s*([а-яё]*)\s*\}\}/gi, (match, key) => {
    const caseName = COUNTRY_CASES[key.toLowerCase()]
    if (!caseName) return match
    return props.countryName ? getCountryPrepositional(props.countryName, caseName) : FALLBACK[caseName]
  })
}

// Текст из админки с подстановкой страны или общий текст
function fieldText(field, fallback) {
  const text = props.section?.[field]?.trim()
  return text ? replaceCountryPlaceholder(text) : fallback
}

// Строки многострочного поля (по одной на строку)
function fieldLines(field) {
  return (props.section?.[field] || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

const countryTo = computed(() => getCountryPrepositional(props.countryName, 'accusative'))

const titleResolved = computed(() =>
  fieldText('title', `Быстрые международные переводы в ${countryTo.value}`),
)

// Банки по одному на строку; стрелки ↑↓ ставятся по очереди.
// Строка, начинающаяся с «+» (например, «+99»), выводится без стрелки
const bankPills = computed(() => {
  const list = fieldLines('banks').map((line) => line.replace(/^[↑↓\s]+/, '').trim()).filter(Boolean)
  let arrowIndex = 0

  return (list.length ? list : DEFAULT_BANKS).map((label) => {
    if (label.startsWith('+')) return { label, arrow: '' }
    const arrow = arrowIndex % 2 ? '↓' : '↑'
    arrowIndex++
    return { label, arrow }
  })
})

const banksTextResolved = computed(() =>
  fieldText('banks_text', `Безопасно и законно отправляйте деньги в ${countryTo.value}: USD, EUR, GBP, RUB`),
)

const citiesText = computed(() => {
  const names = []

  for (let i = 0; i < props.countryCities.length; i++) {
    const name = props.countryCities[i]?.name_city

    if (name) {
      names.push(name)
    }
  }

  return names.join(', ')
})

const walletTextResolved = computed(() =>
  fieldText(
    'wallet_text',
    citiesText.value
      ? `Получайте наличные или оплачивайте услуги в ${getCountryPrepositional(citiesText.value, 'accusative')}`
      : 'Получайте наличные или оплачивайте услуги',
  ),
)

const amountPills = computed(() => {
  const list = fieldLines('amounts')
  return list.length ? list : DEFAULT_AMOUNTS
})

const paymentsTextResolved = computed(() =>
  fieldText('payments_text', `Оплачивайте счета в рублях — мы конвертируем и переведем валюту вашим партнерам в ${countryTo.value}`),
)
</script>
