<template>
  <section v-if="section && steps.length" class="transfer-process-sec">
    <div class="container">
      <h2 v-if="sectionTitle" class="transfer-process-sec__title">
        {{ sectionTitle }}
      </h2>

      <div class="transfer-process-sec__grid">
        <article
          v-for="(step, index) in steps"
          :key="step.id || index"
          class="transfer-process-sec__card"
        >
          <span class="transfer-process-sec__num" aria-hidden="true">{{ index + 1 }}</span>
          <h3 v-if="step.title" class="transfer-process-sec__card-title">{{ step.title }}</h3>
          <p v-if="step.text" class="transfer-process-sec__card-text">{{ step.text }}</p>
        </article>
      </div>

      <div v-if="section.button_text" class="transfer-process-sec__btn-wrap">
        <AppButton type="button" @click="openConsultationModal">
          {{ section.button_text }}
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const props = defineProps({
  countryName: {
    type: String,
    default: '',
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const { data: processResponse } = await useFetch(
  `${urlApi}/api/process-transfer-component?populate[transfer_stap_item]=true`,
)

const section = processResponse.value?.data || null

let sectionTitle = ''

if (section?.section_title) {
  sectionTitle = section.section_title

  if (props.countryName) {
    sectionTitle = sectionTitle + ' ' + props.countryName
  }
}

const steps = []

if (section?.transfer_stap_item) {
  for (let i = 0; i < section.transfer_stap_item.length; i++) {
    const item = section.transfer_stap_item[i]

    if (!item.title && !item.text) continue

    let text = item.text || ''

    if (item.add_country_to_end_text && props.countryName) {
      text = text + ' ' + props.countryName
    }

    steps.push({
      id: item.id || i + 1,
      title: item.title || '',
      text,
    })
  }
}

const modalStore = useModalStore()

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}
</script>
