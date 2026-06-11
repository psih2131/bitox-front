<template>
  <section ref="sectionRef" class="service-other-sec">
    <div class="container">
      <h2 class="service-other-sec__title">Другие наши услуги</h2>

      <div class="service-other-sec__grid">
        <NuxtLink
          v-for="item in otherServices"
          :key="item.slug"
          :to="`/services/${item.slug}`"
          class="service-other-sec__card"
        >
          <div class="service-other-sec__preview">
            <img
              :src="previewImage"
              alt=""
              class="service-other-sec__preview-img"
            />
          </div>

          <div class="service-other-sec__body">
            <h3 class="service-other-sec__card-title">{{ item.title }}</h3>
            <p class="service-other-sec__card-text">{{ item.subtitle }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { services } from '~/data/services'
import previewImage from '~/assets/images/serv-prev.jpg'

const props = defineProps({
  currentSlug: {
    type: String,
    required: true,
  },
})

const sectionRef = ref(null)

const otherServices = computed(() => (
  services.filter((service) => service.slug !== props.currentSlug).slice(0, 4)
))

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
