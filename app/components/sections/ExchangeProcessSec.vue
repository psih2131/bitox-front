<template>
  <section ref="sectionRef" class="exchange-process-sec">
    <div class="container">
      <div class="exchange-process-sec__head">
        <h2 v-if="section.title_sec" class="exchange-process-sec__title">{{ section.title_sec }}</h2>
        <p v-if="section.subtitle_sec" class="exchange-process-sec__subtitle">
          {{ section.subtitle_sec }}
        </p>
      </div>

      <div class="exchange-process-sec__grid">
        <article
          v-for="step in steps"
          :key="step.id"
          class="exchange-process-sec__card"
          :class="{ 'exchange-process-sec__card--dark': step.dark }"
        >
          <span class="exchange-process-sec__num">{{ step.num }}</span>
          <h3 class="exchange-process-sec__card-title" v-html="step.title"></h3>
          <p class="exchange-process-sec__card-text" v-html="step.text"></p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const steps = computed(() => {
  const elements = props.section.staps_elements ?? []

  return elements.map((step, index) => ({
    id: step.id,
    num: String(index + 1).padStart(2, '0'),
    title: step.title,
    text: step.subtitle,
    dark: index === elements.length - 1,
  }))
})

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.exchange-process-sec__head', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.exchange-process-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
