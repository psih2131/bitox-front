<template>
  <section ref="sectionRef" class="business-countries-sec">
    <div class="container">
      <h2 v-if="sectionTitle" class="business-countries-sec__title">
        {{ sectionTitle }}
      </h2>

      <ul class="business-countries-sec__list">
        <li
          v-for="country in visibleCountries"
          :key="country.id"
          class="business-countries-sec__item"
        >
          <NuxtLink
            :to="`${linkBase}/${country.slug}`"
            class="business-countries-sec__pill"
          >
            <img
              v-if="country.flag"
              :src="country.flag"
              alt=""
              class="business-countries-sec__flag"
            />
            <span class="business-countries-sec__name">{{ country.name }}</span>
          </NuxtLink>
        </li>
      </ul>

      <div v-if="hasMoreCountries && !showAll" class="business-countries-sec__more">
        <AppBannerBtn type="button" @click="showAll = true">
          Показать все
        </AppBannerBtn>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  countries: {
    type: Array,
    default: () => [],
  },
  linkBase: {
    type: String,
    default: '/business/invoice',
  },
})

const VISIBLE_LIMIT = 30

const sectionRef = ref(null)
const showAll = ref(false)

const sectionTitle = computed(() => props.title || 'Оплата инвойсов по всему миру')

const hasMoreCountries = computed(() => props.countries.length > VISIBLE_LIMIT)

const visibleCountries = computed(() => {
  if (showAll.value || !hasMoreCountries.value) {
    return props.countries
  }

  return props.countries.slice(0, VISIBLE_LIMIT)
})

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
      },
    })

    timeline
      .from('.business-countries-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.business-countries-sec__item', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out',
      }, '-=0.3')
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
