<template>
  <section v-if="apiReviews.length" ref="sectionRef" class="home-reviews-sec">
    <div class="container">
      <h2 class="home-reviews-sec__title">Отзывы о Bitox</h2>

      <div class="home-reviews-sec__filters">
        <a
          href="#"
          class="home-reviews-sec__filter home-reviews-sec__filter--pill"
          :class="{ 'is-active': activeCategoryId === null }"
          @click.prevent="selectCategory(null)"
        >
          Все отзывы
        </a>

        <div class="home-reviews-sec__filter-platforms">
          <a
            v-for="filter in platformFilters"
            :key="filter.id"
            href="#"
            class="home-reviews-sec__filter home-reviews-sec__filter--platform"
            :class="{ 'is-active': activeCategoryId === filter.id }"
            @click.prevent="selectCategory(filter.id)"
          >
            <img
              v-if="filter.icon"
              :src="filter.icon"
              :alt="filter.alt"
              width="34"
              height="34"
              class="home-reviews-sec__filter-icon"
              loading="lazy"
            />
            <span v-if="filter.label" class="home-reviews-sec__filter-label">{{ filter.label }}</span>
          </a>
        </div>
      </div>

      <p class="home-reviews-sec__count" v-if="reviewsCountStore">{{ reviewsCountStore  }}</p>
    </div>
     

    
    <div class="home-reviews-sec__slider-outer">
      <button
        type="button"
        class="home-reviews-sec__arrow home-reviews-sec__arrow--prev"
        aria-label="Предыдущий слайд"
        :disabled="isBeginning"
        @click="prev"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L5.64645 12.3536L5.29289 12L5.64645 11.6464L6 12ZM18 11.5C18.2761 11.5 18.5 11.7239 18.5 12C18.5 12.2761 18.2761 12.5 18 12.5L18 12L18 11.5ZM10 16L9.64645 16.3536L5.64645 12.3536L6 12L6.35356 11.6464L10.3536 15.6464L10 16ZM6 12L5.64645 11.6464L9.64645 7.64645L10 8L10.3536 8.35355L6.35356 12.3536L6 12ZM6 12L6 11.5L18 11.5L18 12L18 12.5L6 12.5L6 12Z" fill="currentColor" />
        </svg>
      </button>

      <div class="container">
        <div ref="viewportRef" class="home-reviews-sec__viewport">
          <div
            ref="trackRef"
            class="home-reviews-sec__track"
            :class="{ 'is-resetting': !isTransitionEnabled }"
            :style="{
              gap: `${gap}px`,
              transform: `translateX(-${offset}px)`,
            }"
            @transitionend="onTrackTransitionEnd"
          >
            <article
              v-for="review in loopReviews"
              :key="review.loopKey"
              class="home-reviews-sec__card"
              :style="{ width: `${slideWidth}px` }"
            >
              <div class="home-reviews-sec__card-head">
                <div class="home-reviews-sec__card-top">
                  <div
                    class="home-reviews-sec__avatar"
                    :style="{ backgroundColor: review.avatarColor }"
                  >
                    {{ review.initials }}
                  </div>

                  <div class="home-reviews-sec__stars" :aria-label="`Оценка ${review.rate ?? 5} из 5`">
                    <svg
                      v-for="n in 5"
                      :key="n"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 1.3335L9.88533 5.8855L14.6667 6.51216L11.3333 9.8855L12.228 14.6668L8 12.5122L3.772 14.6668L4.66667 9.8855L1.33333 6.51216L6.11467 5.8855L8 1.3335Z"
                        :fill="n <= (review.rate ?? 5) ? '#FFDD2D' : '#E5E7EB'"
                      />
                    </svg>
                  </div>
                </div>

                <p class="home-reviews-sec__name">{{ review.name }}</p>
                <p class="home-reviews-sec__date">{{ review.date }}</p>
              </div>

              <p class="home-reviews-sec__text">{{ review.text }}</p>

              <footer class="home-reviews-sec__footer">
                <a
                  v-if="review.link"
                  :href="review.link"
                  class="home-reviews-sec__source"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ review.source }}
                </a>
                <span v-else class="home-reviews-sec__source">{{ review.source }}</span>
              </footer>
            </article>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="home-reviews-sec__arrow home-reviews-sec__arrow--next"
        aria-label="Следующий слайд"
        :disabled="isEnd"
        @click="next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 12L18.3536 11.6464L18.7071 12L18.3536 12.3536L18 12ZM6 12.5C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5V12V12.5ZM14 8L14.3536 7.64645L18.3536 11.6464L18 12L17.6464 12.3536L13.6464 8.35355L14 8ZM18 12L18.3536 12.3536L14.3536 16.3536L14 16L13.6464 15.6464L17.6464 11.6464L18 12ZM18 12V12.5H6V12V11.5H18V12Z" fill="currentColor" />
        </svg>
      </button>
    </div>

    <div class="container">
      <div v-if="paginationCount > 1" class="home-reviews-sec__pagination">
        <button
          v-for="page in paginationCount"
          :key="page"
          type="button"
          class="home-reviews-sec__dot"
          :class="{ 'is-active': logicalIndex === page - 1 }"
          :aria-label="`Слайд ${page}`"
          @click="goToPage(page - 1)"
        />
      </div>
    </div>
  </section>
</template>


<script setup>
import gsap from 'gsap'
import logo2gis from '~/assets/images/logos/review-2gis.svg'
import logoZoon from '~/assets/images/logos/review-zoon.svg'
import logoYandex from '~/assets/images/logos/review-yandex.svg'
import { mapStrapiReviewCategories, mapStrapiReviews } from '~/utils/strapi'

import { useCounterStore } from '~/stores/counter'

const store = useCounterStore()
const urlApi = useRuntimeConfig().public.apiUrl

const reviewsPopulate = [
  'populate[reviews_category][populate]=img',
  'pagination[pageSize]=100',
].join('&')

const [{ data: reviewsResponse }, { data: categoriesResponse }] = await Promise.all([
  useFetch(`${urlApi}/api/reviews?${reviewsPopulate}`),
  useFetch(`${urlApi}/api/reviews-categories?populate[img]=true&pagination[pageSize]=100`),
])

const sectionRef = ref(null)
const viewportRef = ref(null)
const trackRef = ref(null)
const activeCategoryId = ref(null)
const currentIndex = ref(0)
const visibleCount = ref(4)
const slideWidth = ref(0)
const gap = ref(18)
const offset = ref(0)
const isTransitionEnabled = ref(true)

const defaultPlatformFilters = [
  { id: '2gis', label: '5.0', href: '#', icon: logo2gis, alt: '2ГИС' },
  { id: 'zoon', label: '4.7', href: '#', icon: logoZoon, alt: 'Zoon' },
  { id: 'yandex', label: '5.0', href: '#', icon: logoYandex, alt: 'Яндекс' },
]

const platformFilters = computed(() => {
  const categories = mapStrapiReviewCategories(categoriesResponse.value?.data ?? [], urlApi)

  return categories.length ? categories : defaultPlatformFilters
})

const apiReviews = computed(() => mapStrapiReviews(reviewsResponse.value?.data ?? [], urlApi))

const filteredReviews = computed(() => {
  if (activeCategoryId.value === null) return apiReviews.value

  return apiReviews.value.filter((review) => review.categoryId === activeCategoryId.value)
})

const baseLength = computed(() => filteredReviews.value.length)

const canLoop = computed(() => baseLength.value > visibleCount.value)

const loopReviews = computed(() => {
  const reviews = filteredReviews.value

  if (!reviews.length) return []

  if (!canLoop.value) {
    return reviews.map((review) => ({
      ...review,
      loopKey: String(review.id),
    }))
  }

  return [0, 1, 2].flatMap((copy) => (
    reviews.map((review) => ({
      ...review,
      loopKey: `${review.id}-${copy}`,
    }))
  ))
})

function getSlideStep() {
  return slideWidth.value + gap.value
}

function resetSliderPosition() {
  if (canLoop.value) {
    currentIndex.value = baseLength.value
  } else {
    currentIndex.value = 0
  }

  isTransitionEnabled.value = false
  offset.value = currentIndex.value * getSlideStep()

  nextTick(() => {
    isTransitionEnabled.value = true
  })
}

function selectCategory(categoryId) {
  activeCategoryId.value = categoryId
  resetSliderPosition()
  nextTick(updateSlider)
}

function pluralizeReviews(count) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'отзыв'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'отзыва'

  return 'отзывов'
}

function pluralizeSources(count) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'источник'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'источника'

  return 'источников'
}

const reviewsCountText = computed(() => {
  const count = filteredReviews.value.length

  if (activeCategoryId.value !== null) {
    const filter = platformFilters.value.find((item) => item.id === activeCategoryId.value)
    const sourceName = filter?.alt || 'источника'

    return `${count} ${pluralizeReviews(count)} из ${sourceName}`
  }

  const sources = platformFilters.value.length

  return `${count} ${pluralizeReviews(count)} из ${sources} ${pluralizeSources(sources)}`
})

const reviewsCountStore = computed(() => store.globalInfo?.reviews_counter_text || reviewsCountText.value)

const maxIndex = computed(() => Math.max(0, baseLength.value - visibleCount.value))
const logicalIndex = computed(() => (
  canLoop.value ? currentIndex.value - baseLength.value : currentIndex.value
))
const isBeginning = computed(() => !canLoop.value && currentIndex.value === 0)
const isEnd = computed(() => !canLoop.value && currentIndex.value >= maxIndex.value)
const paginationCount = computed(() => (
  canLoop.value
    ? Math.max(1, baseLength.value - visibleCount.value + 1)
    : maxIndex.value + 1
))

function getVisibleCount(width) {
  if (width >= 992) return 4
  if (width >= 768) return 3
  if (width >= 576) return 2
  return 1
}

function getGap(width) {
  if (width >= 992) return 18
  if (width >= 768) return 16
  return 12
}

function updateSlider() {
  if (!viewportRef.value) return

  const width = viewportRef.value.offsetWidth
  visibleCount.value = getVisibleCount(width)
  gap.value = getGap(width)

  const count = visibleCount.value
  slideWidth.value = (width - gap.value * (count - 1)) / count

  if (!canLoop.value && currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value
  }

  offset.value = currentIndex.value * getSlideStep()
}

function normalizeLoopIndex() {
  const len = baseLength.value

  if (!canLoop.value || !len) return

  if (currentIndex.value >= len * 2) {
    isTransitionEnabled.value = false
    currentIndex.value -= len
    offset.value = currentIndex.value * getSlideStep()
    nextTick(() => {
      isTransitionEnabled.value = true
    })
  } else if (currentIndex.value < len) {
    isTransitionEnabled.value = false
    currentIndex.value += len
    offset.value = currentIndex.value * getSlideStep()
    nextTick(() => {
      isTransitionEnabled.value = true
    })
  }
}

function onTrackTransitionEnd(event) {
  if (event.propertyName !== 'transform') return

  normalizeLoopIndex()
}

function prev() {
  if (isBeginning.value) return

  currentIndex.value -= 1
  offset.value = currentIndex.value * getSlideStep()
}

function next() {
  if (isEnd.value) return

  currentIndex.value += 1
  offset.value = currentIndex.value * getSlideStep()
}

function goToPage(index) {
  if (canLoop.value) {
    currentIndex.value = baseLength.value + Math.min(index, paginationCount.value - 1)
  } else {
    currentIndex.value = Math.min(index, maxIndex.value)
  }

  offset.value = currentIndex.value * getSlideStep()
}

let reviewsAnimation
let resizeObserver

onMounted(() => {
  updateSlider()
  resetSliderPosition()

  resizeObserver = new ResizeObserver(() => {
    const wasLooping = canLoop.value
    updateSlider()

    if (wasLooping !== canLoop.value) {
      resetSliderPosition()
    }
  })
  if (viewportRef.value) {
    resizeObserver.observe(viewportRef.value)
  }

  if (!sectionRef.value) return

  reviewsAnimation = gsap.context(() => {
    gsap.from('.home-reviews-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.home-reviews-sec__filters, .home-reviews-sec__count', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  reviewsAnimation?.revert()
})
</script>
