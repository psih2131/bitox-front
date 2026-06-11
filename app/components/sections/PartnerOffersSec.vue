<template>
  <section ref="sectionRef" class="partner-offers-sec">
    <div class="container">
      <h2 class="partner-offers-sec__title">Что мы предлагаем</h2>
      <p class="partner-offers-sec__subtitle">Условия партнёрской программы bitox</p>

      <div class="partner-offers-sec__grid">
        <article
          v-for="card in cards"
          :key="card.id"
          class="partner-offers-sec__card"
        >
          <img
            :src="card.image"
            alt=""
            class="partner-offers-sec__card-img"
          />

          <h3 class="partner-offers-sec__card-title">{{ card.title }}</h3>
          <p class="partner-offers-sec__card-text">{{ card.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import gr9 from '~/assets/images/gr-9.png'
import gr10 from '~/assets/images/gr-10.png'
import gr11 from '~/assets/images/gr-11.png'

const sectionRef = ref(null)

const cards = [
  {
    id: 1,
    image: gr9,
    title: 'Выгодная комиссия',
    text: 'Гибкий процент с каждой сделки, индивидуально под каждого партнёра. До 30% от прибыли bitox',
  },
  {
    id: 2,
    image: gr10,
    title: 'Прозрачные условия',
    text: 'Индивидуальный процент комиссии в зависимости от объёма. Все начисления видны в личном кабинете.',
  },
  {
    id: 3,
    image: gr11,
    title: 'Готовые инструменты',
    text: 'Личный кабинет с дашбордом по доходам, реферальные ссылки, промо-материалы и сопровождение менеджера.',
  },
]

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
