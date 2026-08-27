<template>
  <section class="cta-sec">
    <div class="container cta-sec__inner">
      <img
        :src="ctaImage"
        alt=""
        class="cta-sec__img"
        width="606"
        height="446"
      />

      <div class="cta-sec__content">
        <div v-if="sectionTitleLines.length" class="cta-sec__title">
          <template v-for="(line, index) in sectionTitleLines" :key="index">
            {{ line }}<br v-if="index < sectionTitleLines.length - 1" />
          </template>
        </div>

        <div class="cta-sec__actions">
          <AppClientBtn @click="openConsultationModal">{{ section.button_text_yellow }}</AppClientBtn>
          <AppConsultBtn @click="openCallbackModal">{{ section.button_text_white }}</AppConsultBtn>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
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

const ctaImage = computed(() => getStrapiMediaUrl(props.section?.image, urlApi) || '')

const sectionTitleLines = computed(() => (
  props.section.title ? props.section.title.split('\n') : []
))
</script>
