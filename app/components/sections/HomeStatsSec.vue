<template>
  <section v-if="stats.length" class="stats-sec">
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

const urlApi = useRuntimeConfig().public.apiUrl
const statsGridRef = ref(null)

const { data: statsResponse } = await useFetch(
  `${urlApi}/api/stats-component?populate[stats_section][populate]=stats_element`,
)

const stats = computed(() => {
  const items = statsResponse.value?.data?.stats_section?.stats_element

  if (!items?.length) return []

  return items.map((item) => ({
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
