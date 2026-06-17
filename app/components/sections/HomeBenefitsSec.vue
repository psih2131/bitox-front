<template>
  <section ref="sectionRef" class="benefits-sec">
    <div class="container">
      <h2 class="benefits-sec__title">{{ sectionTitle }}</h2>

      <div class="benefits-sec__grid">
        <article
          v-for="card in cards"
          :key="card.id"
          class="benefits-sec__card"
          :class="{ 'benefits-sec__card--dark': card.dark }"
        >
          <div class="benefits-sec__card-inner">
            <div class="benefits-sec__card-top">
              <span
                class="benefits-sec__card-icon"
                :class="card.dark ? 'benefits-sec__card-icon--light' : 'benefits-sec__card-icon--dark'"
              >
                <img
                  :src="card.dark ? confBlack : confWhite"
                  alt=""
                />
              </span>
              <h3 class="benefits-sec__card-title">{{ card.title }}</h3>
            </div>

            <p class="benefits-sec__card-text">{{ card.text }}</p>

            <img
              v-if="card.image"
              :src="card.image"
              alt=""
              class="benefits-sec__card-img"
            />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import confBlack from '~/assets/images/icons/conf-black.png'
import confWhite from '~/assets/images/icons/conf-white.png'
import gr3 from '~/assets/images/gr-3.png'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const sectionRef = ref(null)

const defaultCards = [
  {
    id: 'security',
    title: 'Безопасность',
    text: 'Соблюдение чистоты на всех уровнях, от шифрования на серверах до документооборота',
  },
  {
    id: 'sanctions',
    title: 'Отсутствие санкционного следа',
    text: 'Подберем плательщика из 70+ компаний из разных стран без связей с Россией',
    wide: true,
    image: gr3,
  },
  {
    id: 'deadlines',
    title: 'Сроки',
    text: 'От 2 часов до 5 дней',
  },
  {
    id: 'service',
    title: 'Сервис',
    text: 'Персональный менеджер по Телефону и в удобном для вас мессенджере, поддержка на нескольких языках',
  },
  {
    id: 'convenience',
    title: 'Удобство',
    text: 'Предложим удобный для вас способ оплаты',
    dark: true,
  },
]

const sectionTitle = computed(() => props.section?.title_section || 'Выгоды работы с нами')

const cards = computed(() => {
  if (!props.section?.benefits_items?.length) return defaultCards

  const items = props.section.benefits_items

  return items.map((item, index) => ({
    id: item.id,
    title: item.title,
    text: item.subtitle,
    dark: index === items.length - 1,
  }))
})

let benefitsAnimation

onMounted(() => {
  if (!sectionRef.value) return

  benefitsAnimation = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
      },
    })

    timeline
      .from('.benefits-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.benefits-sec__card', {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.benefits-sec__card-img', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
  }, sectionRef.value)
})

onUnmounted(() => {
  benefitsAnimation?.revert()
})
</script>
