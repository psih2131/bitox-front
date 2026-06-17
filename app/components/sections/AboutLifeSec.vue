<template>
  <section ref="sectionRef" class="about-life-sec">
    <div class="container">
      <div class="about-life-sec__head">
        <h2 class="about-life-sec__title">{{ section.title }}</h2>
        <p class="about-life-sec__subtitle">{{ section.subtitle }}</p>
      </div>

      <div ref="galleryRef" class="about-life-sec__gallery">
        <div class="about-life-sec__grid">
          <a
            v-for="image in mainImages"
            :key="image.id"
            :href="image.full"
            class="about-life-sec__item"
            :class="`about-life-sec__item--${image.layout}`"
            data-fancybox="about-life"
            :data-caption="image.caption"
          >
            <img
              :src="image.thumb"
              :alt="image.caption"
              class="about-life-sec__item-img"
            />
          </a>
        </div>

        <div v-if="!hasMore" class="about-life-sec__grid about-life-sec__grid--more">
          <a
            v-for="image in moreImages"
            :key="image.id"
            :href="image.full"
            class="about-life-sec__item about-life-sec__item--more"
            data-fancybox="about-life"
            :data-caption="image.caption"
          >
            <img
              :src="image.thumb"
              :alt="image.caption"
              class="about-life-sec__item-img"
            />
          </a>
        </div>
      </div>

      <div v-if="hasMore && moreImages.length" class="about-life-sec__more">
        <AppClientBtn type="button" @click="showMore">
          Показать больше
        </AppClientBtn>
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

const { $fancybox } = useNuxtApp()
const apiUrl = useRuntimeConfig().public.apiUrl

const sectionRef = ref(null)
const galleryRef = ref(null)
const hasMore = ref(true)

const layoutOrder = ['large', 'top-left', 'top-right', 'wide']

const galleryImages = computed(() => {
  return (props.section.img_gallery ?? [])
    .filter((item) => item.image)
    .map((item, index) => {
      const url = getStrapiMediaUrl(item.image, apiUrl)

      return {
        id: item.id,
        thumb: url,
        full: url,
        caption: item.image.alternativeText || item.image.name || '',
        layout: layoutOrder[index] ?? 'more',
      }
    })
})

const mainImages = computed(() => galleryImages.value.slice(0, 4))
const moreImages = computed(() => galleryImages.value.slice(4))

let sectionAnimation

const bindFancybox = () => {
  if (!galleryRef.value) return

  $fancybox.unbind(galleryRef.value)
  $fancybox.bind(galleryRef.value, '[data-fancybox="about-life"]', {})
}

const showMore = () => {
  hasMore.value = false
  nextTick(() => bindFancybox())
}

onMounted(() => {
  if (!sectionRef.value) return

  bindFancybox()

  sectionAnimation = gsap.context(() => {
    gsap.from('.about-life-sec__head', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.about-life-sec__item', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  if (galleryRef.value) {
    $fancybox.unbind(galleryRef.value)
  }

  sectionAnimation?.revert()
})
</script>
