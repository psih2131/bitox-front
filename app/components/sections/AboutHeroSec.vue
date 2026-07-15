<template>
  <section ref="sectionRef" class="about-hero-sec">
    <div class="container">
      <nav class="about-hero-sec__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="about-hero-sec__breadcrumb-link">Главная</NuxtLink>
        <span class="about-hero-sec__breadcrumb-sep">/</span>
        <span class="about-hero-sec__breadcrumb-current">О компании</span>
      </nav>

      <h1 class="about-hero-sec__title">{{ section.section_title }}</h1>

      <div class="about-hero-sec__cards-wrap">
        <img
          :src="heroImageSrc"
          alt=""
          class="about-hero-sec__globe"
          width="280"
          height="280"
        />

        <div class="about-hero-sec__grid">
          <article
            v-for="(card, index) in section.box_list_element"
            :key="card.id"
            class="about-hero-sec__card"
            :class="{ 'about-hero-sec__card--dark': index === section.box_list_element.length - 1 }"
          >
            <span
              class="about-hero-sec__card-icon"
              :class="index === section.box_list_element.length - 1
                ? 'about-hero-sec__card-icon--light'
                : 'about-hero-sec__card-icon--dark'"
            >
              <img
                :src="index === section.box_list_element.length - 1 ? confBlack : confWhite"
                alt=""
              />
            </span>
            <div class="about-hero-sec__data">
              <p class="about-hero-sec__card-value">{{ card.title }}</p>
              <p class="about-hero-sec__card-text">{{ card.subtitle }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import confBlack from '~/assets/images/icons/conf-black.png'
import confWhite from '~/assets/images/icons/conf-white.png'
import fallbackHeroImage from '~/assets/images/gr-13.png'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl
const heroImageSrc = computed(
  () => getStrapiMediaUrl(props.section?.image, urlApi) || fallbackHeroImage,
)

const sectionRef = ref(null)

let heroAnimation

onMounted(() => {
  if (!sectionRef.value) return

  heroAnimation = gsap.context(() => {
    gsap.from('.about-hero-sec__breadcrumbs', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: 'power2.out',
    })

    gsap.from('.about-hero-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.about-hero-sec__globe', {
      opacity: 0,
      scale: 0.9,
      duration: 0.7,
      delay: 0.15,
      ease: 'power2.out',
    })

    gsap.from('.about-hero-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  heroAnimation?.revert()
})
</script>
