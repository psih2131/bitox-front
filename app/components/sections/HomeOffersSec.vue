<template>
  <section ref="sectionRef" class="offers-sec">
    <div class="container">
      <div class="offers-sec__head">
        <h2 class="offers-sec__title">{{ sectionTitle }}</h2>

        <div class="offers-sec__nav">
          <button
            type="button"
            class="offers-sec__arrow"
            aria-label="Предыдущий слайд"
            :disabled="swiperReady && isBeginning"
            @click="prev()"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L5.64645 12.3536L5.29289 12L5.64645 11.6464L6 12ZM18 11.5C18.2761 11.5 18.5 11.7239 18.5 12C18.5 12.2761 18.2761 12.5 18 12.5L18 12L18 11.5ZM10 16L9.64645 16.3536L5.64645 12.3536L6 12L6.35356 11.6464L10.3536 15.6464L10 16ZM6 12L5.64645 11.6464L9.64645 7.64645L10 8L10.3536 8.35355L6.35356 12.3536L6 12ZM6 12L6 11.5L18 11.5L18 12L18 12.5L6 12.5L6 12Z" fill="white" />
            </svg>
          </button>

          <button
            type="button"
            class="offers-sec__arrow"
            aria-label="Следующий слайд"
            :disabled="swiperReady && isEnd"
            @click="next()"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 12L18.3536 11.6464L18.7071 12L18.3536 12.3536L18 12ZM6 12.5C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5V12V12.5ZM14 8L14.3536 7.64645L18.3536 11.6464L18 12L17.6464 12.3536L13.6464 8.35355L14 8ZM18 12L18.3536 12.3536L14.3536 16.3536L14 16L13.6464 15.6464L17.6464 11.6464L18 12ZM18 12V12.5H6V12V11.5H18V12Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>

      <ClientOnly>
        <swiper-container ref="swiperRef" :init="false" class="offers-sec__slider">
          <swiper-slide v-for="slide in slides" :key="slide.id">
            <div class="offers-sec__slide">
              <div class="offers-sec__slide-content">
                <h3 v-if="slide.title" class="offers-sec__slide-title" v-html="slide.title"></h3>
                <p v-if="slide.text" class="offers-sec__slide-text" v-html="slide.text"></p>
                <a v-if="slide.link" :href="slide.link" class="app-banner-btn">{{ slide.btn }}</a>
                <AppBannerBtn v-else>{{ slide.btn }}</AppBannerBtn>
              </div>

              <div class="offers-sec__slide-img">
                <img :src="slide.image" alt="" />
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import AppBannerBtn from '~/components/buttons/AppBannerBtn.vue'
import banner1 from '~/assets/images/banner-1.png'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const sectionRef = ref(null)
const swiperRef = ref(null)

const defaultSlides = [
  {
    id: 1,
    title: 'Скидка -50% на первый платеж',
    text: 'Выгодные условия для новых клиентов',
    btn: 'Узнать подробнее',
    link: null,
    image: banner1,
  },
]

const sectionTitle = computed(() => props.section.title_sec || 'Спецпредложения')

const slides = computed(() => {
  if (!props.section.banners?.length) return defaultSlides

  return props.section.banners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    text: banner.subtitle,
    btn: banner.button_text,
    link: banner.button_link || null,
    image: getStrapiMediaUrl(banner.banner_image, apiUrl) || banner1,
  }))
})

const swiperReady = ref(false)

const { next, prev, isBeginning, isEnd, reInitialize } = useSwiper(swiperRef, {
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 500,
})

watch(swiperRef, async (el) => {
  if (!el) return

  await nextTick()
  reInitialize()
  swiperReady.value = true
})

watch(slides, async () => {
  if (!swiperRef.value) return

  await nextTick()
  reInitialize()
})

let offersAnimation

onMounted(() => {
  if (!sectionRef.value) return

  offersAnimation = gsap.context(() => {
    gsap.from('.offers-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.offers-sec__slide-content > *', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.25,
      ease: 'power2.out',
    })

    gsap.from('.offers-sec__slide-img', {
      opacity: 0,
      x: 40,
      duration: 0.7,
      delay: 0.35,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  offersAnimation?.revert()
})
</script>
