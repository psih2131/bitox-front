<template>
  <section ref="sectionRef" class="home-reviews-sec">
    <div class="container">
      <h2 class="home-reviews-sec__title">Отзывы</h2>

      <div class="home-reviews-sec__filters">
        <a
          href="#"
          class="home-reviews-sec__filter home-reviews-sec__filter--pill"
          :class="{ 'is-active': activeFilter === 'all' }"
          @click.prevent="activeFilter = 'all'"
        >
          Все отзывы
        </a>

        <div class="home-reviews-sec__filter-platforms">
          <a
            v-for="filter in platformFilters"
            :key="filter.id"
            :href="filter.href"
            class="home-reviews-sec__filter home-reviews-sec__filter--platform"
            :class="{ 'is-active': activeFilter === filter.id }"
            @click.prevent="activeFilter = filter.id"
          >
            <img
              :src="filter.icon"
              :alt="filter.alt"
              width="34"
              height="34"
              class="home-reviews-sec__filter-icon"
            />
            <span class="home-reviews-sec__filter-label">{{ filter.label }}</span>
          </a>
        </div>
      </div>

      <p class="home-reviews-sec__count">42 отзыва из 3 источников</p>
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
            class="home-reviews-sec__track"
            :style="{
              gap: `${gap}px`,
              transform: `translateX(-${offset}px)`,
            }"
          >
            <article
              v-for="review in reviews"
              :key="review.id"
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

                  <div class="home-reviews-sec__stars" aria-label="Оценка 5 из 5">
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
                        fill="#FFDD2D"
                      />
                    </svg>
                  </div>
                </div>

                <p class="home-reviews-sec__name">{{ review.name }}</p>
                <p class="home-reviews-sec__date">{{ review.date }}</p>
              </div>

              <p class="home-reviews-sec__text">{{ review.text }}</p>

              <footer class="home-reviews-sec__footer">
                <span class="home-reviews-sec__source">{{ review.source }}</span>
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
          :class="{ 'is-active': currentIndex === page - 1 }"
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

const sectionRef = ref(null)
const viewportRef = ref(null)
const activeFilter = ref('all')
const currentIndex = ref(0)
const visibleCount = ref(4)
const slideWidth = ref(0)
const gap = ref(18)
const offset = ref(0)

const platformFilters = [
  { id: '2gis', label: '5.0', href: '#', icon: logo2gis, alt: '2ГИС' },
  { id: 'zoon', label: '4.7', href: '#', icon: logoZoon, alt: 'Zoon' },
  { id: 'yandex', label: '5.0', href: '#', icon: logoYandex, alt: 'Яндекс' },
]

const reviews = [
  {
    id: 1,
    initials: 'АК',
    name: 'Артем Конов',
    date: '12 мая 2026 г.',
    avatarColor: '#9A9A9A',
    text: 'Пользуемся сервисом уже больше года. Платежи проходят быстро, менеджеры всегда на связи и помогают с документами. Для нашего бизнеса это очень удобно.',
    source: 'Отзыв из Zoon',
  },
  {
    id: 2,
    initials: 'БА',
    name: 'Борис Андреев',
    date: '8 мая 2026 г.',
    avatarColor: '#4A7FD4',
    text: 'Отличный сервис для международных переводов. Всё прозрачно, без скрытых комиссий. Оплата поставщику из Китая прошла за пару часов.',
    source: 'Отзыв из 2ГИС',
  },
  {
    id: 3,
    initials: 'МС',
    name: 'Максим Соколов',
    date: '3 мая 2026 г.',
    avatarColor: '#0073FA',
    text: 'Рекомендую. Удобный личный кабинет, понятные тарифы и быстрая обработка заявок. Несколько раз выручали в срочных ситуациях.',
    source: 'Отзыв из Яндекс',
  },
  {
    id: 4,
    initials: 'ОК',
    name: 'Ольга Кузнецова',
    date: '28 апреля 2026 г.',
    avatarColor: '#F5A623',
    text: 'Переводили крупную сумму за оборудование — всё прошло без задержек. Поддержка ответила на все вопросы по валютному контролю.',
    source: 'Отзыв из Zoon',
  },
  {
    id: 5,
    initials: 'ДВ',
    name: 'Дмитрий Волков',
    date: '22 апреля 2026 г.',
    avatarColor: '#6B7280',
    text: 'Надёжный партнёр для регулярных платежей. За полгода ни одного срыва сроков. Документооборот организован чётко.',
    source: 'Отзыв из 2ГИС',
  },
  {
    id: 6,
    initials: 'ЕМ',
    name: 'Елена Морозова',
    date: '15 апреля 2026 г.',
    avatarColor: '#8B5CF6',
    text: 'Первый раз работали с валютными платежами — всё объяснили и сопроводили на каждом этапе. Очень благодарна команде.',
    source: 'Отзыв из Яндекс',
  },
  {
    id: 7,
    initials: 'ИП',
    name: 'Игорь Петров',
    date: '10 апреля 2026 г.',
    avatarColor: '#10B981',
    text: 'Скорость обработки впечатляет. Заявку подали утром, к обеду деньги уже ушли получателю. Будем продолжать сотрудничество.',
    source: 'Отзыв из Zoon',
  },
  {
    id: 8,
    initials: 'НС',
    name: 'Наталья Смирнова',
    date: '5 апреля 2026 г.',
    avatarColor: '#EC4899',
    text: 'Удобно, что можно отслеживать статус платежа в реальном времени. Курс фиксируется сразу, без неприятных сюрпризов.',
    source: 'Отзыв из 2ГИС',
  },
  {
    id: 9,
    initials: 'СЛ',
    name: 'Сергей Лебедев',
    date: '1 апреля 2026 г.',
    avatarColor: '#3B82F6',
    text: 'Работаем с bitox уже третий квартал. Всё стабильно, документы готовят быстро, менеджеры всегда на связи.',
    source: 'Отзыв из Яндекс',
  },
]

const maxIndex = computed(() => Math.max(0, reviews.length - visibleCount.value))
const isBeginning = computed(() => currentIndex.value === 0)
const isEnd = computed(() => currentIndex.value >= maxIndex.value)
const paginationCount = computed(() => maxIndex.value + 1)

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
  offset.value = currentIndex.value * (slideWidth.value + gap.value)

  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value
    offset.value = currentIndex.value * (slideWidth.value + gap.value)
  }
}

function prev() {
  if (isBeginning.value) return
  currentIndex.value -= 1
  offset.value = currentIndex.value * (slideWidth.value + gap.value)
}

function next() {
  if (isEnd.value) return
  currentIndex.value += 1
  offset.value = currentIndex.value * (slideWidth.value + gap.value)
}

function goToPage(index) {
  currentIndex.value = Math.min(index, maxIndex.value)
  offset.value = currentIndex.value * (slideWidth.value + gap.value)
}

let reviewsAnimation
let resizeObserver

onMounted(() => {
  updateSlider()

  resizeObserver = new ResizeObserver(updateSlider)
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
