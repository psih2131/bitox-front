<template>
  <section v-if="section" ref="sectionRef" class="service-economy-sec">
    <div class="container">
      <div class="service-economy-sec__card">
        <div class="service-economy-sec__content">
          <div class="service-economy-sec__content-top">
            <h2 v-if="section.title" class="service-economy-sec__title">
              {{ section.title }}
            </h2>

            <p v-if="section.subtitle" class="service-economy-sec__subtitle">
              {{ section.subtitle }}
            </p>
          </div>

          <div class="service-economy-sec__actions">
            <AppClientBtn>{{ section.button_title_yellow || 'Стать клиентом' }}</AppClientBtn>
            <AppConsultBtn>{{ section.button_title_white || 'Бесплатная консультация' }}</AppConsultBtn>
          </div>
        </div>

        <div class="service-economy-sec__features">
          <article
            v-for="feature in features"
            :key="feature.id"
            class="service-economy-sec__feature"
          >
            <img
              v-if="feature.image"
              :src="feature.image"
              alt=""
              class="service-economy-sec__feature-img"
            />

            <div class="service-economy-sec__feature-body">
              <h3 v-if="feature.title" class="service-economy-sec__feature-title">{{ feature.title }}</h3>
              <p v-if="feature.text" class="service-economy-sec__feature-text">{{ feature.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const features = computed(() =>
  (props.section.economy_list_items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    text: item.text,
    image: getStrapiMediaUrl(item.image, apiUrl),
  })),
)

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-economy-sec__card', {
      opacity: 0,
      y: 32,
      duration: 0.7,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
