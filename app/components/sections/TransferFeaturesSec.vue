<template>
  <section class="transfer-features-sec">
    <div class="container">
      <h2 class="transfer-features-sec__title">
        Быстрые международные переводы в {{ getCountryPrepositional(countryName, 'accusative') }}
      </h2>

      <div class="transfer-features-sec__grid">
        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual">
            <div class="transfer-features-sec__pills">
              <span v-for="(pill, index) in pills" :key="index" class="transfer-features-sec__pill">
                <span v-if="pill.arrow" class="transfer-features-sec__pill-arrow">{{ pill.arrow }}</span> {{ pill.label }}
              </span>
            </div>
          </div>

          <p class="transfer-features-sec__text">
            {{ featuresTextResolved }}
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

          <p class="transfer-features-sec__text" v-if="citiesText">
            Получайте наличные или оплачивайте услуги в <span v-if="citiesText"> {{ getCountryPrepositional(citiesText, 'accusative') }}</span>
          </p>
          <p class="transfer-features-sec__text" v-else>
            Получайте наличные или оплачивайте услуги
          </p>
        </article>

        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual">
            <div class="transfer-features-sec__pills">
              <span class="transfer-features-sec__pill">-6 789 USD</span>
              <span class="transfer-features-sec__pill">-3 499 EUR</span>
              <span class="transfer-features-sec__pill">-10 099 EUR</span>
              <span class="transfer-features-sec__pill">-54 795 USD</span>
            </div>
          </div>

          <p class="transfer-features-sec__text">
            Оплачивайте счета в рублях — мы конвертируем и переведем валюту вашим партнерам в {{ getCountryPrepositional(countryName, 'accusative') }}
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
  // Из админки (страница перевода): банки по одному на строку и текст под ними.
  // Если пусто — показываем общие значения
  featuresBanks: {
    type: String,
    default: '',
  },
  featuresText: {
    type: String,
    default: '',
  },
})

// Общие плашки, если у страны в админке банки не заполнены
const DEFAULT_BANKS = ['WISE', 'Revolut', 'BBVA', 'N26', '+99']

// Банки по одному на строку; стрелки ↑↓ ставятся по очереди.
// Строка, начинающаяся с «+» (например, «+99»), выводится без стрелки
const pills = computed(() => {
  const list = (props.featuresBanks || '')
    .split('\n')
    .map((line) => line.replace(/^[↑↓\s]+/, '').trim())
    .filter(Boolean)

  let arrowIndex = 0

  return (list.length ? list : DEFAULT_BANKS).map((label) => {
    if (label.startsWith('+')) return { label, arrow: '' }
    const arrow = arrowIndex % 2 ? '↓' : '↑'
    arrowIndex++
    return { label, arrow }
  })
})

// Метки страны в тексте (в админке): «в {{куда}}» → «в Китай», «в {{где}}» → «в Китае»,
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

const featuresTextResolved = computed(() => {
  const text = props.featuresText?.trim()
  if (text) return replaceCountryPlaceholder(text)

  return `Безопасно и законно отправляйте деньги в ${getCountryPrepositional(props.countryName, 'accusative')}: USD, EUR, GBP, RUB`
})

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
</script>
