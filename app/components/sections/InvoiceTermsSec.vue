<template>
  <section v-if="section && items.length" class="invoice-terms-sec">
    <div class="container">
      <h2 v-if="section.title_section" class="invoice-terms-sec__title">
        {{ section.title_section }}
      </h2>

      <div class="invoice-terms-sec__card">
        <div class="invoice-terms-sec__layout">
          <div class="invoice-terms-sec__list">
            <article
              v-for="(item, index) in items"
              :key="item.id"
              class="invoice-terms-sec__item"
              :class="{ 'invoice-terms-sec__item--active': activeId === item.id }"
            >
              <button
                type="button"
                class="invoice-terms-sec__header"
                :aria-expanded="activeId === item.id"
                @click="selectItem(item.id)"
              >
                <span class="invoice-terms-sec__num">{{ index + 1 }}.</span>
                <span class="invoice-terms-sec__question">{{ item.title }}</span>
                <span class="invoice-terms-sec__arrow" aria-hidden="true">
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </button>

              <ClientOnly>
                <Vue3SlideUpDown :model-value="activeId === item.id" :duration="400" class="invoice-terms-sec__mobile-panel">
                  <div class="invoice-terms-sec__body">
                    <p v-if="item.text" class="invoice-terms-sec__text">{{ item.text }}</p>
                  </div>
                </Vue3SlideUpDown>
              </ClientOnly>
            </article>
          </div>

          <div class="invoice-terms-sec__panel">
            <template v-if="activeItem">
              <h3 v-if="activeItem.title" class="invoice-terms-sec__subtitle">{{ activeItem.title }}</h3>
              <p v-if="activeItem.text" class="invoice-terms-sec__text">{{ activeItem.text }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Vue3SlideUpDown } from 'vue3-slide-up-down'

const props = defineProps({
  countryName: {
    type: String,
    default: '',
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const { data: termsResponse } = await useFetch(
  `${urlApi}/api/invoice-terms-component?populate[term_items]=true`,
)

const section = termsResponse.value?.data || null

const items = []

if (section?.term_items) {
  for (let i = 0; i < section.term_items.length; i++) {
    const item = section.term_items[i]

    if (!item.title && !item.text) continue

    let text = item.text || ''

    if (props.countryName && text.includes('СТРАНУ')) {
      text = text.split('СТРАНУ').join(props.countryName)
    }

    items.push({
      id: item.id || i + 1,
      title: item.title || '',
      text,
    })
  }
}

const activeId = ref(items[0]?.id ?? null)

const activeItem = computed(() => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === activeId.value) return items[i]
  }

  return null
})

function selectItem(id) {
  activeId.value = id
}
</script>
