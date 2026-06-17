<template>
  <section ref="sectionRef" class="service-examples-sec">
    <div class="container">
      <div class="service-examples-sec__head">
        <h2 class="service-examples-sec__title">{{ sectionTitle }}</h2>

        <div class="service-examples-sec__arrows">
          <button
            type="button"
            class="service-examples-sec__arrow"
            aria-label="Предыдущий слайд"
            :disabled="isBeginning"
            @click="prev"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L5.64645 12.3536L5.29289 12L5.64645 11.6464L6 12ZM18 11.5C18.2761 11.5 18.5 11.7239 18.5 12C18.5 12.2761 18.2761 12.5 18 12.5L18 12L18 11.5ZM10 16L9.64645 16.3536L5.64645 12.3536L6 12L6.35356 11.6464L10.3536 15.6464L10 16ZM6 12L5.64645 11.6464L9.64645 7.64645L10 8L10.3536 8.35355L6.35356 12.3536L6 12ZM6 12L6 11.5L18 11.5L18 12L18 12.5L6 12.5L6 12Z" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            class="service-examples-sec__arrow"
            aria-label="Следующий слайд"
            :disabled="isEnd"
            @click="next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 12L18.3536 11.6464L18.7071 12L18.3536 12.3536L18 12ZM6 12.5C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5V12V12.5ZM14 8L14.3536 7.64645L18.3536 11.6464L18 12L17.6464 12.3536L13.6464 8.35355L14 8ZM18 12L18.3536 12.3536L14.3536 16.3536L14 16L13.6464 15.6464L17.6464 11.6464L18 12ZM18 12V12.5H6V12V11.5H18V12Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="service-examples-sec__slider-outer">
      <div class="container">
        <div ref="viewportRef" class="service-examples-sec__viewport">
          <div
            class="service-examples-sec__track"
            :style="{
              gap: `${gap}px`,
              transform: `translateX(-${offset}px)`,
            }"
          >
            <article
              v-for="example in examples"
              :key="example.id"
              class="service-examples-sec__card"
              :style="{ width: `${slideWidth}px` }"
            >
              <div class="service-examples-sec__card-media">
                <img
                  :src="example.image"
                  alt=""
                  class="service-examples-sec__card-img"
                />

                <div v-if="example.tags?.length" class="service-examples-sec__tags">
                  <span
                    v-for="tag in example.tags"
                    :key="tag"
                    class="service-examples-sec__tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div class="service-examples-sec__card-body">
                <p class="service-examples-sec__card-date">{{ example.date }}</p>
                <h3 class="service-examples-sec__card-title">{{ example.title }}</h3>

                <div class="service-examples-sec__meta">
                  <div
                    v-for="field in example.fields"
                    :key="field.label"
                    class="service-examples-sec__meta-cell"
                  >
                    <span class="service-examples-sec__meta-label">{{ field.label }}</span>
                    <span class="service-examples-sec__meta-value">{{ field.value }}</span>
                  </div>
                </div>

                <button
                  v-if="example.hasFullDescription"
                  type="button"
                  class="app-btn service-examples-sec__btn"
                  @click="openFullDescription(example)"
                >
                  Читать подробнее
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import exampleImage from '~/assets/images/exm-1.jpg'
import { MODAL_NAMES, useModalStore } from '~/stores/modal'
import { hasRichTextContent } from '~/utils/formatBlogText'
import { formatShortDate, getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl
const modalStore = useModalStore()

const sectionRef = ref(null)
const viewportRef = ref(null)
const currentIndex = ref(0)
const visibleCount = ref(3)
const slideWidth = ref(0)
const gap = ref(20)
const offset = ref(0)

const defaultExamples = [
  {
    id: 1,
    title: 'Оплата валютного контракта',
    date: '11.11.2026',
    image: exampleImage,
    fields: [
      { label: 'Клиент', value: 'Российская фабрика мебели' },
      { label: 'Страна перевода', value: 'Польша' },
      { label: 'Сумма', value: '75 000 EUR' },
      { label: 'Срок исполнения', value: '4 рабочих дня' },
    ],
    tags: ['Тег', 'Тег'],
  },
  {
    id: 2,
    title: 'Оплата валютного контракта',
    date: '11.11.2026',
    image: exampleImage,
    fields: [
      { label: 'Клиент', value: 'Российская фабрика мебели' },
      { label: 'Страна перевода', value: 'Польша' },
      { label: 'Сумма', value: '75 000 EUR' },
      { label: 'Срок исполнения', value: '4 рабочих дня' },
    ],
    tags: ['Тег', 'Тег'],
  },
  {
    id: 3,
    title: 'Оплата валютного контракта',
    date: '11.11.2026',
    image: exampleImage,
    fields: [
      { label: 'Клиент', value: 'Российская фабрика мебели' },
      { label: 'Страна перевода', value: 'Польша' },
      { label: 'Сумма', value: '75 000 EUR' },
      { label: 'Срок исполнения', value: '4 рабочих дня' },
    ],
    tags: ['Тег', 'Тег'],
  },
  {
    id: 4,
    title: 'Оплата валютного контракта',
    date: '11.11.2026',
    image: exampleImage,
    fields: [
      { label: 'Клиент', value: 'Российская фабрика мебели' },
      { label: 'Страна перевода', value: 'Польша' },
      { label: 'Сумма', value: '75 000 EUR' },
      { label: 'Срок исполнения', value: '4 рабочих дня' },
    ],
    tags: ['Тег', 'Тег'],
  },
]

const sectionTitle = computed(() => props.section?.title || 'Примеры оплат инвойсов')

function mapExampleFields(item) {
  return [
    { label: 'Клиент', value: item.client },
    { label: 'Страна перевода', value: item.country },
    { label: 'Сумма', value: item.price },
    { label: 'Срок исполнения', value: item.time },
  ].filter((field) => field.value)
}

const examples = computed(() => {
  if (!props.section?.examples_items?.length) return defaultExamples

  return props.section.examples_items.map((item) => ({
    id: item.id,
    title: item.title,
    date: formatShortDate(item.date),
    image: getStrapiMediaUrl(item.image, apiUrl) || exampleImage,
    fields: mapExampleFields(item),
    tags: [],
    fullDescription: item.full_description || '',
    hasFullDescription: hasRichTextContent(item.full_description),
  }))
})

function openFullDescription(example) {
  modalStore.open(MODAL_NAMES.textContent, {
    title: example.title,
    content: example.fullDescription,
  })
}

const maxIndex = computed(() => Math.max(0, examples.value.length - visibleCount.value))
const isBeginning = computed(() => currentIndex.value === 0)
const isEnd = computed(() => currentIndex.value >= maxIndex.value)

function getVisibleCount(width) {
  if (width >= 1200) return 3
  if (width >= 768) return 2
  return 1
}

function getGap(width) {
  return width >= 768 ? 20 : 12
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

let sectionAnimation
let resizeObserver

onMounted(() => {
  updateSlider()

  resizeObserver = new ResizeObserver(updateSlider)
  if (viewportRef.value) {
    resizeObserver.observe(viewportRef.value)
  }

  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-examples-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  sectionAnimation?.revert()
})
</script>
