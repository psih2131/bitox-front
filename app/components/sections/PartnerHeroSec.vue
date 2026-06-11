<template>
  <section ref="sectionRef" class="partner-hero-sec">
    <div class="container partner-hero-sec__inner">
      <div class="partner-hero-sec__content">
        <nav class="partner-hero-sec__breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/" class="partner-hero-sec__breadcrumb-link">Главная</NuxtLink>
          <span class="partner-hero-sec__breadcrumb-sep">/</span>
          <span class="partner-hero-sec__breadcrumb-current">Партнерская программа</span>
        </nav>

        <div class="partner-hero-sec__title-wrap">
          <h1 class="partner-hero-sec__title">
            Партнерская
            программа для
            агентов до 30%
          </h1>

          <span class="partner-hero-sec__badge">Станьте партнёром bitox</span>
        </div>

        <p class="partner-hero-sec__text">
          Вы приводите клиентов на обмен криптовалюты или международный платеж,
          а мы платим вам комиссию с каждой сделки — без потолка по объёму
        </p>

        <AppClientBtn class="partner-hero-sec__btn">Обсудить условия</AppClientBtn>
      </div>

      <img
        :src="heroImage"
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
import heroImage from '~/assets/images/gr-8.png'

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
