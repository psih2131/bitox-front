<template>
  <section v-if="cards.length" class="benefits-sec">
    <div class="container">
      <h2 class="benefits-sec__title">{{ sectionTitle }}</h2>

      <div class="benefits-sec__grid">
        <article
          v-for="card in cards"
          :key="card.id"
          class="benefits-sec__card"
          :class="{ 'benefits-sec__card--dark': card.dark }"
        >
          <div class="benefits-sec__card-inner">
            <div class="benefits-sec__card-top">
              <span
                class="benefits-sec__card-icon"
                :class="card.dark ? 'benefits-sec__card-icon--light' : 'benefits-sec__card-icon--dark'"
              >
                <img
                  :src="card.dark ? confBlack : confWhite"
                  alt=""
                  loading="lazy"
                />
              </span>
              <div class="benefits-sec__card-title">{{ card.title }}</div>
            </div>

            <p class="benefits-sec__card-text">{{ card.text }}</p>

            <img
              v-if="card.image"
              :src="card.image"
              alt=""
              class="benefits-sec__card-img"
              loading="lazy"
            />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import confBlack from '~/assets/images/icons/conf-black.png'
import confWhite from '~/assets/images/icons/conf-white.png'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

function isBenefitsSectionFilled(section) {
  if (!section) return false
  if (typeof section.title_section === 'string' && section.title_section.trim()) return true
  if (section.benefits_items?.length) return true
  return false
}

const useExternalSection = isBenefitsSectionFilled(props.section)

const { data: benefitsResponse } = await useFetch(
  () => (useExternalSection
    ? null
    : `${urlApi}/api/benefits-component?populate[benefits_sec][populate][benefits_items]=true&populate[benefits_sec][populate][image_for_box_2]=true`),
)

const section = computed(() => {
  if (useExternalSection) return props.section
  return benefitsResponse.value?.data?.benefits_sec
})

const sectionTitle = computed(() => section.value?.title_section || 'Выгоды работы с нами')

const box2Image = computed(() => getStrapiMediaUrl(section.value?.image_for_box_2, urlApi))

const cards = computed(() => {
  const items = section.value?.benefits_items

  if (!items?.length) return []

  return items.map((item, index) => ({
    id: item.id,
    title: item.title,
    text: item.subtitle,
    dark: index === items.length - 1,
    image: index === 1 ? box2Image.value : null,
  }))
})
</script>
