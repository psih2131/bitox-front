<template>
  <section v-if="section" ref="sectionRef" class="service-invoices-sec">
    <div class="container service-invoices-sec__inner">
      <h2 v-if="section.title" class="service-invoices-sec__title">
        {{ section.title }}
      </h2>

      <div class="service-invoices-sec__grid">
        <article
          v-for="card in cards"
          :key="card.id"
          class="service-invoices-sec__card"
        >
          <div class="service-invoices-sec__card-media">
            <img
              v-if="card.image"
              :src="card.image"
              alt=""
              class="service-invoices-sec__card-img"
            />
          </div>

          <div class="service-invoices-sec__card-body">
            <h3 v-if="card.title" class="service-invoices-sec__card-title">{{ card.title }}</h3>
            <p v-if="card.text" class="service-invoices-sec__card-text">{{ card.text }}</p>

            <div v-if="card.tags.length" class="service-invoices-sec__tags">
              <span
                v-for="tag in card.tags"
                :key="tag"
                class="service-invoices-sec__tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
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

const cards = computed(() =>
  (props.section.invoice_elements ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    text: item.subtitle,
    image: getStrapiMediaUrl(item.invoice_image, apiUrl),
    tags: (item.invoice_element_list_items ?? [])
      .map((tag) => tag.name)
      .filter(Boolean),
  })),
)

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-invoices-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.service-invoices-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.6,
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
