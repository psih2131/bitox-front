<template>
  <section v-if="otherServices.length" ref="sectionRef" class="service-other-sec">
    <div class="container">
      <h2 class="service-other-sec__title">Другие наши услуги</h2>

      <div class="service-other-sec__grid">
        <NuxtLink
          v-for="item in otherServices"
          :key="item.documentId"
          :to="`/business/${item.slug}`"
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
import { mapStrapiBusinessPages } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const { data: businessPagesResponse } = await useFetch(
  `${urlApi}/api/business-pages?fields[0]=title&fields[1]=slug&fields[2]=subtitle&populate=preview_image&pagination[pageSize]=100`,
)

const sectionRef = ref(null)

const excludedSlug = computed(() => {
  const match = route.path.match(/^\/business\/([^/]+)$/)

  return match?.[1] ?? null
})

const otherServices = computed(() => {
  const pages = mapStrapiBusinessPages(businessPagesResponse.value?.data ?? [], urlApi)

  if (!excludedSlug.value) {
    return pages
  }

  return pages.filter((page) => page.slug !== excludedSlug.value)
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
