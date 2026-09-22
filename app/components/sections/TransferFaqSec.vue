<template>
  <section v-if="faqItems.length" class="faq-sec">
    <div class="container">
      <h2 v-if="faqTitle" class="faq-sec__title">{{ faqTitle }}</h2>

      <div class="faq-sec__list">
        <FaqItem
          v-for="item in faqItems"
          :key="item.id"
          :question="item.question"
          :answer="item.answer"
        />
      </div>
    </div>
  </section>
</template>

<script setup>

import { getCountryPrepositional } from '~/utils/getCountryPrepositional'

const props = defineProps({
  countryName: {
    type: String,
    default: '',
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const { data: faqResponse } = await useFetch(
  `${urlApi}/api/transfers-faq-component?populate[faq_sec][populate]=questions_list`,
)

const section = faqResponse.value?.data?.faq_sec || null



function replaceCountryPlaceholder(text) {
  if (!text) return ''
  if (!props.countryName) return text
  if (!text.includes('{{}}')) return text

  const countryForm = getCountryPrepositional(props.countryName)

  return text.split('{{}}').join(countryForm)
}

let faqTitle = ''

if (section?.title) {
  faqTitle = replaceCountryPlaceholder(section.title)
}

const faqItems = []

if (section?.questions_list) {
  for (let i = 0; i < section.questions_list.length; i++) {
    const item = section.questions_list[i]
    const question = replaceCountryPlaceholder(item.title || '')
    const answer = replaceCountryPlaceholder(item.text || '')

    if (!question && !answer) continue

    faqItems.push({
      id: item.id || i + 1,
      question,
      answer,
    })
  }
}
</script>
