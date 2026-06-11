<template>
  <section ref="sectionRef" class="cta-sec">
    <div class="container cta-sec__inner">
      <img
        :src="ctaImage"
        alt=""
        class="cta-sec__img"
        width="606"
        height="446"
      />

      <div class="cta-sec__content">
        <h2 class="cta-sec__title">
          Начните экономить<br />
          на международных платежах уже сегодня
        </h2>

        <div class="cta-sec__actions">
          <AppClientBtn>Стать клиентом</AppClientBtn>
          <AppConsultBtn>Бесплатная консультация</AppConsultBtn>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import ctaImage from '~/assets/images/gr-4.png'

const sectionRef = ref(null)

let ctaAnimation

onMounted(() => {
  if (!sectionRef.value) return

  ctaAnimation = gsap.context(() => {
    gsap.from('.cta-sec__img', {
      opacity: 0,
      x: -32,
      duration: 0.7,
      ease: 'power2.out',
    })

    gsap.from('.cta-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.cta-sec__actions', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.25,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctaAnimation?.revert()
})
</script>
