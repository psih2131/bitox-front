<template>
  <section ref="sectionRef" class="not-found-hero-sec">
    <div class="container not-found-hero-sec__inner">
      <div class="not-found-hero-sec__content">
        <h1 class="not-found-hero-sec__title">Ошибка 404</h1>

        <p class="not-found-hero-sec__text">
          Похоже, что-то пошло не так или страница была перемещена.
          Вы можете вернуться на главную и выбрать нужный раздел
        </p>

        <NuxtLink
          to="/"
          class="app-client-btn not-found-hero-sec__btn"
          @click="handleGoHome"
        >
          На главную
        </NuxtLink>
      </div>

      <img
        :src="heroImage"
        alt=""
        class="not-found-hero-sec__img"
        width="520"
        height="520"
      />
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import heroImage from '~/assets/images/gr-17.png'

const sectionRef = ref(null)

function handleGoHome() {
  clearError({ redirect: '/' })
}

let heroAnimation

onMounted(() => {
  if (!sectionRef.value) return

  heroAnimation = gsap.context(() => {
    const timeline = gsap.timeline()

    timeline
      .from('.not-found-hero-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.not-found-hero-sec__text', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.35')
      .from('.not-found-hero-sec__btn', {
        opacity: 0,
        y: 16,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.not-found-hero-sec__img', {
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
