<template>
  <section ref="sectionRef" class="about-company-sec">
    <div class="container about-company-sec__inner">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
        class="about-company-sec__img"
        width="520"
        height="520"
      />

      <div class="about-company-sec__content">
        <h2 class="about-company-sec__title">{{ section.section_title }}</h2>

        <div class="text-editor">
          <p v-for="(paragraph, index) in paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { getStrapiMediaUrl, splitParagraphs } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const imageUrl = computed(() => getStrapiMediaUrl(props.section.section_image, apiUrl))
const paragraphs = computed(() => splitParagraphs(props.section.description))

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.about-company-sec__img', {
      opacity: 0,
      x: -24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.about-company-sec__content', {
      opacity: 0,
      x: 24,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
