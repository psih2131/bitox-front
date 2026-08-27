<template>
  <section class="offers-sec">
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
                <div v-if="slide.title" class="offers-sec__slide-title" v-html="slide.title"></div>
                <p v-if="slide.text" class="offers-sec__slide-text" v-html="slide.text"></p>
                <a v-if="slide.link" :href="slide.link" class="app-banner-btn">{{ slide.btn }}</a>
                <AppBannerBtn v-else @click="openConsultationModal">{{ slide.btn }}</AppBannerBtn>
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
import AppBannerBtn from '~/components/buttons/AppBannerBtn.vue'
import { getStrapiMediaUrl } from '~/utils/strapi'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const modalStore = useModalStore()

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

const apiUrl = useRuntimeConfig().public.apiUrl

const swiperRef = ref(null)

const defaultSlides = [
  {
    id: 1,
    title: 'Скидка -50% на первый платеж',
    text: 'Выгодные условия для новых клиентов',
    btn: 'Узнать подробнее',
    link: null,
    image: '',
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
    image: getStrapiMediaUrl(banner.banner_image, apiUrl) || '',
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
</script>
