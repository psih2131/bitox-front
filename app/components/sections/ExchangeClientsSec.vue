<template>
  <section v-if="cases.length" ref="sectionRef" class="exchange-clients-sec">
    <div class="container">
      <h2 v-if="section.section_title" class="exchange-clients-sec__title">
        {{ section.section_title }}
      </h2>

      <div class="exchange-clients-sec__nav">
        <button
          type="button"
          class="exchange-clients-sec__arrow"
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
          class="exchange-clients-sec__arrow"
          aria-label="Следующий слайд"
          :disabled="swiperReady && isEnd"
          @click="next()"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12L18.3536 11.6464L18.7071 12L18.3536 12.3536L18 12ZM6 12.5C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5V12V12.5ZM14 8L14.3536 7.64645L18.3536 11.6464L18 12L17.6464 12.3536L13.6464 8.35355L14 8ZM18 12L18.3536 12.3536L14.3536 16.3536L14 16L13.6464 15.6464L17.6464 11.6464L18 12ZM18 12V12.5H6V12V11.5H18V12Z" fill="white" />
          </svg>
        </button>
      </div>

      <div class="exchange-clients-sec__list">
        <article
          v-for="item in cases"
          :key="item.id"
          class="exchange-clients-sec__card"
        >
          <div class="exchange-clients-sec__aside">
            <span class="exchange-clients-sec__icon">
              <img :src="confWhite" alt="" />
            </span>
            <h3 class="exchange-clients-sec__aside-title">{{ item.title }}</h3>
          </div>

          <p class="exchange-clients-sec__text">{{ item.description }}</p>
        </article>
      </div>

      <div class="exchange-clients-sec__slider-wrap">
        <ClientOnly>
          <swiper-container ref="swiperRef" :init="false" class="exchange-clients-sec__slider">
            <swiper-slide v-for="item in cases" :key="`slide-${item.id}`">
              <article class="exchange-clients-sec__card exchange-clients-sec__card--slide">
                <div class="exchange-clients-sec__aside">
                  <span class="exchange-clients-sec__icon">
                    <img :src="confWhite" alt="" />
                  </span>
                  <h3 class="exchange-clients-sec__aside-title">{{ item.title }}</h3>
                </div>

                <p class="exchange-clients-sec__text">{{ item.description }}</p>
              </article>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>

      <div v-if="cases.length > 1" class="exchange-clients-sec__pagination">
        <button
          v-for="(item, index) in cases"
          :key="`dot-${item.id}`"
          type="button"
          class="exchange-clients-sec__dot"
          :class="{ 'is-active': currentIndex === index }"
          :aria-label="`Слайд ${index + 1}`"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import confWhite from '~/assets/images/icons/conf-white.png'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const cases = computed(() => props.section.element ?? [])

const sectionRef = ref(null)
const swiperRef = ref(null)
const swiperReady = ref(false)
const currentIndex = ref(0)

const { next, prev, isBeginning, isEnd, reInitialize } = useSwiper(swiperRef, {
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 500,
})

function goToSlide(index) {
  swiperRef.value?.swiper?.slideTo(index)
}

function onSlideChange(event) {
  const swiper = event.detail?.[0]

  if (swiper) {
    currentIndex.value = swiper.activeIndex
  }
}

watch(swiperRef, async (el, _, onCleanup) => {
  if (!el) return

  el.addEventListener('swiperslidechange', onSlideChange)
  onCleanup(() => {
    el.removeEventListener('swiperslidechange', onSlideChange)
  })

  await nextTick()
  reInitialize()
  swiperReady.value = true
  currentIndex.value = swiperRef.value?.swiper?.activeIndex ?? 0
})

watch(cases, async () => {
  if (!swiperRef.value) return

  await nextTick()
  reInitialize()
  currentIndex.value = swiperRef.value?.swiper?.activeIndex ?? 0
})

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.exchange-clients-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.exchange-clients-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.12,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.exchange-clients-sec__slider-wrap', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
