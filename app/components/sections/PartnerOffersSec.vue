<template>
  <section v-if="section" ref="sectionRef" class="partner-offers-sec">
    <div class="container">
      <h2 v-if="section.section_title" class="partner-offers-sec__title">
        {{ section.section_title }}
      </h2>
      <p v-if="section.subtitle_section" class="partner-offers-sec__subtitle">
        {{ section.subtitle_section }}
      </p>

      <div class="partner-offers-sec__grid">
        <article
          v-for="card in cards"
          :key="card.id"
          class="partner-offers-sec__card"
        >
          <img
            v-if="card.image"
            :src="card.image"
            alt=""
            class="partner-offers-sec__card-img"
          />

          <h3 v-if="card.title" class="partner-offers-sec__card-title">{{ card.title }}</h3>
          <p v-if="card.subtitle" class="partner-offers-sec__card-text">{{ card.subtitle }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const cards = computed(() =>
  (props.section.partnership_offer_items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    image: getStrapiMediaUrl(item.image, apiUrl),
  })),
)

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.partner-offers-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.partner-offers-sec__subtitle', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.partner-offers-sec__card', {
      opacity: 0,
      y: 28,
      duration: 0.6,
      stagger: 0.12,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
