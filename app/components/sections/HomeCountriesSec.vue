<template>
  <section ref="sectionRef" class="countries-sec">
    <div class="container countries-sec__top">
      <h2 v-if="sectionTitle" class="countries-sec__title">
        {{ sectionTitle }}
      </h2>

      <div class="countries-sec__search-wrap">
        <div class="countries-sec__search-row">
          <div class="countries-sec__input-wrap">
            <input
              v-model="query"
              type="text"
              class="countries-sec__input"
              placeholder="Введите страну"
            />

            <button
              v-if="query"
              type="button"
              class="countries-sec__clear"
              aria-label="Очистить"
              @mousedown.prevent
              @click="clearQuery"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <button type="button" class="countries-sec__find-btn">
            Найти
          </button>
        </div>

        <ul v-if="showResults" class="countries-sec__results">
          <li
            v-for="country in filteredCountries"
            :key="country.id"
            class="countries-sec__result"
          >
            <img :src="country.flag" alt="" class="countries-sec__result-flag" />
            <span class="countries-sec__result-name">{{ country.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="countries-sec__slider">
      <div class="countries-sec__slider-track">
        <div
          v-for="groupIndex in 2"
          :key="groupIndex"
          class="countries-sec__slider-group"
          :aria-hidden="groupIndex === 2"
        >
          <div
            v-for="(country, index) in sliderGroup"
            :key="`${groupIndex}-${country.id}-${index}`"
            class="countries-sec__pill"
          >
            <img :src="country.flag" alt="" class="countries-sec__pill-flag" />
            <span class="countries-sec__pill-name">{{ country.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container countries-sec__bottom">
      <AppBannerBtn>{{ buttonTitle }}</AppBannerBtn>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import flag1 from '~/assets/images/flags/x1.jpg'
import flag2 from '~/assets/images/flags/x2.jpg'
import flag3 from '~/assets/images/flags/x3.jpg'
import flag4 from '~/assets/images/flags/x4.jpg'
import flag5 from '~/assets/images/flags/x5.jpg'
import flag6 from '~/assets/images/flags/x6.jpg'
import { getStrapiMediaUrl } from '~/utils/strapi'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const sectionRef = ref(null)
const query = ref('')

const defaultCountries = [
  { id: 'italy', name: 'Италия', flag: flag1, keywords: ['ит', 'ital'] },
  { id: 'england', name: 'Англия', flag: flag2, keywords: ['анг', 'eng'] },
  { id: 'turkey', name: 'Турция', flag: flag3, keywords: ['ty', 'тур', 'tur'] },
  { id: 'usa', name: 'США', flag: flag4, keywords: ['сша', 'usa'] },
  { id: 'canada', name: 'Канада', flag: flag5, keywords: ['кан', 'can'] },
  { id: 'mexico', name: 'Мексика', flag: flag6, keywords: ['мекс', 'mex', 'me'] },
  { id: 'china', name: 'Китай', flag: flag4, keywords: ['кит', 'chi', 'ki'] },
]

const sectionTitle = computed(() => props.section?.title || 'Международные платежи по всему миру')
const buttonTitle = computed(() => props.section?.button_title || 'Узнать как сэкономить на платеже')

const countries = computed(() => {
  if (!props.section?.countries_list?.length) return defaultCountries

  return props.section.countries_list.map((item) => {
    const name = item.title || ''

    return {
      id: item.id,
      name,
      flag: getStrapiMediaUrl(item.image, apiUrl),
      keywords: [name.toLowerCase().slice(0, 3)].filter(Boolean),
    }
  })
})

const sliderGroup = computed(() => Array.from({ length: 3 }, () => countries.value).flat())

const filteredCountries = computed(() => {
  const value = query.value.trim().toLowerCase()
  if (!value) return []

  return countries.value.filter((country) => {
    const nameMatch = country.name.toLowerCase().includes(value)
    const keywordMatch = country.keywords.some((keyword) => keyword.includes(value) || value.includes(keyword))
    return nameMatch || keywordMatch
  })
})

const showResults = computed(() => query.value.trim().length > 0 && filteredCountries.value.length > 0)

function clearQuery() {
  query.value = ''
}

let countriesAnimation

onMounted(() => {
  if (!sectionRef.value) return

  countriesAnimation = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
      },
    })

    timeline
      .from('.countries-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.countries-sec__search-wrap', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.countries-sec__pill', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
      }, '-=0.2')
      .from('.countries-sec__bottom', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
  }, sectionRef.value)
})

onUnmounted(() => {
  countriesAnimation?.revert()
})
</script>
