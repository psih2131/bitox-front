<template>
  <section ref="sectionRef" class="crypto-hero-sec">
    <div class="container crypto-hero-sec__inner">
      <div class="crypto-hero-sec__content">
        <nav class="crypto-hero-sec__breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/" class="crypto-hero-sec__breadcrumb-link">Главная</NuxtLink>
          <span class="crypto-hero-sec__breadcrumb-sep">/</span>
          <span class="crypto-hero-sec__breadcrumb-current">Обмен криптовалюты</span>
        </nav>

        <h1 class="crypto-hero-sec__title">
          Обмен
          криптовалюты
        </h1>

        <p class="crypto-hero-sec__text">
          Пункты приёма и выдачи наличных в России и по всему миру.
          Для бизнеса и частных лиц.
        </p>

        <AppClientBtn class="crypto-hero-sec__btn">Заявка на обмен</AppClientBtn>
      </div>

      <img
        :src="heroImage"
        alt=""
        class="crypto-hero-sec__img"
        width="520"
        height="520"
      />
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import heroImage from '~/assets/images/gr-15.png'

const sectionRef = ref(null)

let heroAnimation

onMounted(() => {
  if (!sectionRef.value) return

  heroAnimation = gsap.context(() => {
    const timeline = gsap.timeline()

    timeline
      .from('.crypto-hero-sec__breadcrumbs', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
      })
      .from('.crypto-hero-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.crypto-hero-sec__text', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.35')
      .from('.crypto-hero-sec__btn', {
        opacity: 0,
        y: 16,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.crypto-hero-sec__img', {
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
