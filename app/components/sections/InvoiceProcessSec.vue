<template>
  <section v-if="section" class="invoice-process-sec">
    <div class="container">
      <div class="invoice-process-sec__head">
        <h2 v-if="sectionTitle" class="invoice-process-sec__title">
          {{ sectionTitle }}
        </h2>
        <p v-if="section.section_subtitle" class="invoice-process-sec__subtitle">
          {{ section.section_subtitle }}
        </p>
      </div>

      <div v-if="steps.length" class="invoice-process-sec__grid">
        <article
          v-for="(step, index) in steps"
          :key="step.id || index"
          class="invoice-process-sec__card"
        >
          <span class="invoice-process-sec__num" aria-hidden="true">{{ index + 1 }}</span>
          <h3 v-if="step.title" class="invoice-process-sec__card-title">{{ step.title }}</h3>
          <p v-if="step.subtitle" class="invoice-process-sec__card-text">{{ step.subtitle }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  countryName: {
    type: String,
    default: '',
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const { data: processResponse } = await useFetch(
  `${urlApi}/api/invoice-process-component?populate[process_item]=true`,
)

const section = processResponse.value?.data || null

let sectionTitle = ''

if (section?.section_base_title) {
  sectionTitle = section.section_base_title

  if (props.countryName) {
    sectionTitle = sectionTitle + ' ' + props.countryName
  }
}

const steps = []

if (section?.process_item) {
  for (let i = 0; i < section.process_item.length; i++) {
    const item = section.process_item[i]

    if (item.title || item.subtitle) {
      steps.push(item)
    }
  }
}
</script>
