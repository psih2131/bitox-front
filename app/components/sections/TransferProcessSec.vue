<template>
  <section v-if="steps.length" class="transfer-process-sec">
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

      <div v-if="buttonText" class="transfer-process-sec__btn-wrap">
        <AppButton type="button" @click="openConsultationModal">
          {{ buttonText }}
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useModalStore, MODAL_NAMES } from '~/stores/modal'
import { getCountryPrepositional } from '~/utils/getCountryPrepositional'

const props = defineProps({
  countryName: {
    type: String,
    default: '',
  },
  // Блок transfer_process_sec со страницы страны (админка).
  // Пустые поля — берём общий блок _process_transfer_component
  section: {
    type: Object,
    default: null,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const { data: processResponse } = await useFetch(
  `${urlApi}/api/process-transfer-component?populate[transfer_stap_item]=true`,
)

const common = processResponse.value?.data || null
const own = props.section || null

// Метки страны в текстах (в админке): «в {{куда}}» → «в Китай», «в {{где}}» → «в Китае»,
// «из {{откуда}}» → «из Китая», {{кому}}, {{чем}}, {{что}} — остальные падежи
const COUNTRY_CASES = { '': 'accusative', 'куда': 'accusative', 'где': 'prepositional', 'откуда': 'genitive', 'кому': 'dative', 'чем': 'instrumental', 'что': 'nominative' }
const FALLBACK = { accusative: 'страну', prepositional: 'стране', genitive: 'страны', dative: 'стране', instrumental: 'страной', nominative: 'страна' }

function replaceCountryPlaceholder(text) {
  if (!text) return ''

  return text.replace(/\{\{\s*([а-яё]*)\s*\}\}/gi, (match, key) => {
    const caseName = COUNTRY_CASES[key.toLowerCase()]
    if (!caseName) return match
    return props.countryName ? getCountryPrepositional(props.countryName, caseName) : FALLBACK[caseName]
  })
}

let sectionTitle = ''

if (own?.section_title?.trim()) {
  // Свой заголовок страны — как написан, страна только через метки
  sectionTitle = replaceCountryPlaceholder(own.section_title.trim())
} else if (common?.section_title) {
  sectionTitle = common.section_title

  if (props.countryName) {
    sectionTitle = sectionTitle + ' ' + getCountryPrepositional(props.countryName, 'accusative')
  }
}

// Свои шаги страны, если заполнены, иначе общие
const sourceSteps = own?.steps?.length ? own.steps : (common?.transfer_stap_item || [])

const steps = []

for (let i = 0; i < sourceSteps.length; i++) {
  const item = sourceSteps[i]

  if (!item.title && !item.text) continue

  let title = replaceCountryPlaceholder(item.title || '')

  // Галочка add_country_to_end_text дописывает страну к заголовку: «Перевод денег в Китай»
  if (item.add_country_to_end_text && props.countryName) {
    title = title + ' ' + getCountryPrepositional(props.countryName, 'accusative')
  }

  steps.push({
    id: item.id || i + 1,
    title,
    text: replaceCountryPlaceholder(item.text || ''),
  })
}

const buttonText = own?.button_text?.trim() || common?.button_text || ''

const modalStore = useModalStore()

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}
</script>
