<template>
  <section v-if="section" ref="sectionRef" class="service-economy-sec">
    <div class="container">
      <div class="service-economy-sec__card">
        <div class="service-economy-sec__content">
          <div class="service-economy-sec__content-top">
            <h2 v-if="titleText" class="service-economy-sec__title">
              {{ titleText }}
            </h2>

            <p v-if="subtitleText" class="service-economy-sec__subtitle">
              {{ subtitleText }}
            </p>
          </div>

          <div class="service-economy-sec__actions">
            <AppClientBtn @click="openConsultationModal">{{ ownText('button_title_yellow', override) || section.button_title_yellow || 'Стать клиентом' }}</AppClientBtn>
            <AppConsultBtn @click="openCallbackModal">{{ ownText('button_title_white', override) || section.button_title_white || 'Бесплатная консультация' }}</AppConsultBtn>
          </div>
        </div>

        <div class="service-economy-sec__features">
          <article
            v-for="feature in features"
            :key="feature.id"
            class="service-economy-sec__feature"
          >
            <img
              v-if="feature.image"
              :src="feature.image"
              alt=""
              class="service-economy-sec__feature-img"
            />

            <div class="service-economy-sec__feature-body">
              <h3 v-if="feature.title" class="service-economy-sec__feature-title">{{ feature.title }}</h3>
              <p v-if="feature.text" class="service-economy-sec__feature-text">{{ feature.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { getStrapiMediaUrl } from '~/utils/strapi'
import { getCountryPrepositional } from '~/utils/getCountryPrepositional'

import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const props = defineProps({
  sectionTitle: {
    type: String,
    default: null,
  },
  section: {
    type: Object,
    default: null,
  },
  // Замена текстов карточек по порядку: [{ title?, text? }, ...]
  // (например, на страницах переводов вместо общих текстов из админки)
  featureOverrides: {
    type: Array,
    default: () => [],
  },
  // Свой блок страны из админки (тот же формат, что и общий блок).
  // Каждое пустое поле берётся из общего блока; карточки — по порядку
  override: {
    type: Object,
    default: null,
  },
  // Страна для меток {{куда}}, {{где}} и т.д. в текстах своего блока
  countryName: {
    type: String,
    default: '',
  },
})

// Метки страны (в админке): «в {{куда}}» → «в Китай», «в {{где}}» → «в Китае»,
// «из {{откуда}}» → «из Китая», {{кому}}, {{чем}}, {{что}} — остальные падежи
const COUNTRY_CASES = { '': 'accusative', 'куда': 'accusative', 'где': 'prepositional', 'откуда': 'genitive', 'кому': 'dative', 'чем': 'instrumental', 'что': 'nominative' }
const FALLBACK = { accusative: 'страну', prepositional: 'стране', genitive: 'страны', dative: 'стране', instrumental: 'страной', nominative: 'страна' }

function replaceCountryPlaceholder(text) {
  if (!text) return ''

  return text.replace(/\{\{\s*([а-яё]*)\s*\}\}/gi, (match, key) => {
    const caseName = COUNTRY_CASES[key.toLowerCase()]
    if (!caseName) return match
    return props.countryName ? getCountryPrepositional(props.countryName, caseName) : FALLBACK[caseName]
  })
}

// Текст из своего блока страны (с подстановкой страны) или пустая строка
function ownText(field, source) {
  return replaceCountryPlaceholder(source?.[field]?.trim() || '')
}

const modalStore = useModalStore()

const apiUrl = useRuntimeConfig().public.apiUrl
const sectionRef = ref(null)

const { data: economyResponse } = await useFetch(
  () => (props.section ? null : `${apiUrl}/api/economy-component?populate[economy_section][populate][economy_list_items][populate]=image`),
)

const section = computed(() => props.section || economyResponse.value?.data?.economy_section)

const titleText = computed(() => ownText('title', props.override) || props.sectionTitle || section.value?.title || '')

const subtitleText = computed(() => ownText('subtitle', props.override) || section.value?.subtitle || '')

// Карточки: своё у страны → замена из кода страницы → общий блок
const features = computed(() => {
  const commonItems = section.value?.economy_list_items ?? []
  const ownItems = props.override?.economy_list_items ?? []
  const count = Math.max(commonItems.length, ownItems.length)
  const list = []

  for (let index = 0; index < count; index++) {
    const item = commonItems[index] || {}
    const own = ownItems[index]

    list.push({
      id: own?.id || item.id || index,
      title: ownText('title', own) || props.featureOverrides[index]?.title || item.title,
      text: ownText('text', own) || props.featureOverrides[index]?.text || item.text,
      image: getStrapiMediaUrl(own?.image, apiUrl) || getStrapiMediaUrl(item.image, apiUrl),
    })
  }

  return list
})

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

function openCallbackModal() {
  modalStore.open(MODAL_NAMES.callback)
}


let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-economy-sec__card', {
      opacity: 0,
      y: 32,
      duration: 0.7,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
