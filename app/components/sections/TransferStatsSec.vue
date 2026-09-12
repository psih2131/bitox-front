<template>
    <section v-if="stats.length" class="stats-sec">
      <div class="container">
        <div class="stats-sec__grid">
          <div v-for="item in stats" :key="item.id ?? item.value" class="stats-sec__item">
            <p class="stats-sec__value">{{ item.value }}</p>
            <p class="stats-sec__text">{{ item.text }} <span v-if="item.add_country_to_end_text === true && countryName"> {{ countryName }}</span></p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps({
    countryName: {
      type: String,
      default: null,
    },
  })

  const urlApi = useRuntimeConfig().public.apiUrl
  
  const { data: statsResponse } = await useFetch(
    `${urlApi}/api/stats-transfers-component?populate[stats_section][populate]=stats_element`,
  )
  
  const stats = computed(() => {
    const items = statsResponse.value?.data?.stats_section?.stats_element
  
    if (!items?.length) return []
  
    return items.map((item) => ({
      id: item.id,
      value: item.title,
      text: item.subtitle,
      add_country_to_end_text: item.add_country_to_end_text,
    }))
  })
  </script>
  