<template>
  <section v-if="otherServices.length" ref="sectionRef" class="service-other-sec">
    <div class="container">
      <h2 class="service-other-sec__title">Другие наши услуги</h2>

      <div class="service-other-sec__grid">
        <NuxtLink
          v-for="item in otherServices"
          :key="item.documentId"
          :to="{
            path: `/services/${item.slug}`,
            query: { id: item.documentId },
          }"
          class="service-other-sec__card"
        >
          <div class="service-other-sec__preview">
            <img
              :src="item.image || previewImage"
              alt=""
              class="service-other-sec__preview-img"
            />
          </div>

          <div class="service-other-sec__body">
            <h3 class="service-other-sec__card-title">{{ item.title }}</h3>
            <p v-if="item.subtitle" class="service-other-sec__card-text">{{ item.subtitle }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import previewImage from '~/assets/images/serv-prev.jpg'
import { mapStrapiServices } from '~/utils/strapi'

const props = defineProps({
  currentSlug: {
    type: String,
    required: true,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const { data: servicesResponse } = await useFetch(
  `${urlApi}/api/services?populate[service_hero_sec][populate]=image&pagination[pageSize]=100`,
)

const sectionRef = ref(null)

const otherServices = computed(() => {
  const services = mapStrapiServices(servicesResponse.value?.data ?? [], urlApi)

  return services.filter((service) => service.slug !== props.currentSlug)
})

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-other-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
