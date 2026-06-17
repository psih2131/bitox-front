<template>
  <section class="stats-sec">
    <div class="container">
      <div ref="statsGridRef" class="stats-sec__grid">
        <div v-for="item in stats" :key="item.id ?? item.value" class="stats-sec__item">
          <p class="stats-sec__value">{{ item.value }}</p>
          <p class="stats-sec__text">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const statsGridRef = ref(null)

const defaultStats = [
  { value: '70+', text: 'Платежных компаний' },
  { value: '20000+', text: 'Бизнесов и частных лиц доверили нам свои платежи' },
  { value: 'от 2 часов', text: 'Оплатим быстро — даже в критически сжатые сроки' },
  { value: '99%', text: 'Платежей доходят без задержек' },
]

const stats = computed(() => {
  if (!props.section?.stats_element?.length) return defaultStats

  return props.section.stats_element.map((item) => ({
    id: item.id,
    value: item.title,
    text: item.subtitle,
  }))
})

let statsAnimation

onMounted(() => {
  if (!statsGridRef.value) return

  statsAnimation = gsap.context(() => {
    gsap.from('.stats-sec__item', {
      opacity: 0,
      y: 32,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
    })
  }, statsGridRef.value)
})

onUnmounted(() => {
  statsAnimation?.revert()
})
</script>
