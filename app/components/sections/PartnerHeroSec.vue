<template>
  <section v-if="section" ref="sectionRef" class="partner-hero-sec">
    <div class="container partner-hero-sec__inner">
      <div class="partner-hero-sec__content">
        <nav class="partner-hero-sec__breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/" class="partner-hero-sec__breadcrumb-link">Главная</NuxtLink>
          <span class="partner-hero-sec__breadcrumb-sep">/</span>
          <span class="partner-hero-sec__breadcrumb-current">Партнерская программа</span>
        </nav>

        <div class="partner-hero-sec__title-wrap">
          <h1 v-if="section.title" class="partner-hero-sec__title">
            {{ section.title }}
          </h1>

          <span class="partner-hero-sec__badge">Станьте партнёром bitox</span>
        </div>

        <p v-if="section.subtitle" class="partner-hero-sec__text">
          {{ section.subtitle }}
        </p>

        <AppClientBtn
          v-if="section.button_text"
          class="partner-hero-sec__btn"
          @click="openConsultationModal"
        >
          {{ section.button_text }}
        </AppClientBtn>
      </div>

      <img
        v-if="heroImageUrl"
        :src="heroImageUrl"
        alt=""
        class="partner-hero-sec__img"
        width="647"
        height="437"
      />
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl
const modalStore = useModalStore()

const heroImageUrl = computed(
  () => getStrapiMediaUrl(props.section.image, apiUrl) || '',
)

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

const sectionRef = ref(null)

let heroAnimation

onMounted(() => {
  if (!sectionRef.value) return

  heroAnimation = gsap.context(() => {
    const timeline = gsap.timeline()

    timeline
      .from('.partner-hero-sec__breadcrumbs', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
      })
      .from('.partner-hero-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.partner-hero-sec__text', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.35')
      .from('.partner-hero-sec__btn', {
        opacity: 0,
        y: 16,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.partner-hero-sec__img', {
        opacity: 0,
        scale: 0.92,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.45')
  }, sectionRef.value)
})

onUnmounted(() => {
  heroAnimation?.revert()
})
</script>
