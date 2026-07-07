<template>
  <section ref="sectionRef" class="cta-sec">
    <div class="container cta-sec__inner">
      <img
        :src="ctaImage"
        alt=""
        class="cta-sec__img"
        width="606"
        height="446"
      />

      <div class="cta-sec__content">
        <h2 v-if="sectionTitleLines.length" class="cta-sec__title">
          <template v-for="(line, index) in sectionTitleLines" :key="index">
            {{ line }}<br v-if="index < sectionTitleLines.length - 1" />
          </template>
        </h2>

        <div class="cta-sec__actions">
          <AppClientBtn @click="openConsultationModal">{{ section.button_text_yellow }}</AppClientBtn>
          <AppConsultBtn @click="openCallbackModal">{{ section.button_text_white }}</AppConsultBtn>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import fallbackCtaImage from '~/assets/images/gr-4.png'
import { getStrapiMediaUrl } from '~/utils/strapi'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const modalStore = useModalStore()
const urlApi = useRuntimeConfig().public.apiUrl


function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

function openCallbackModal() {
  modalStore.open(MODAL_NAMES.callback)
}


const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const sectionRef = ref(null)

const ctaImage = computed(() => (
  getStrapiMediaUrl(props.section?.image, urlApi) || fallbackCtaImage
))

const sectionTitleLines = computed(() => (
  props.section.title ? props.section.title.split('\n') : []
))

let ctaAnimation

onMounted(() => {
  if (!sectionRef.value) return

  ctaAnimation = gsap.context(() => {
    gsap.from('.cta-sec__img', {
      opacity: 0,
      x: -32,
      duration: 0.7,
      ease: 'power2.out',
    })

    gsap.from('.cta-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.cta-sec__actions', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.25,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctaAnimation?.revert()
})
</script>
