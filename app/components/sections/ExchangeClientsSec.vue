<template>
  <section ref="sectionRef" class="exchange-clients-sec">
    <div class="container">
      <h2 v-if="section.section_title" class="exchange-clients-sec__title">
        {{ section.section_title }}
      </h2>

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
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
