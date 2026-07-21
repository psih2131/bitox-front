<template>
  <main class="contacts-page">
    <ContactsAccountsSec v-if="contact?.contacts_hero_sec" :section="contact.contacts_hero_sec" />
    <AboutContactsSec v-if="contact?.contacts_map_sec" :section="contact.contacts_map_sec" />
    <AboutOfficesSec v-if="contact?.contact_offices_sec" :section="contact.contact_offices_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
const urlApi = useRuntimeConfig().public.apiUrl

const populate = [
  'populate[contacts_hero_sec][populate][telegram_img]=true',
  'populate[contacts_hero_sec][populate][tg_users]=true',
  'populate[contacts_map_sec]=true',
  'populate[contact_offices_sec][populate][offices_map_image]=true',
  'populate[contact_offices_sec][populate][offices_list]=true',
].join('&')

const { data: contactResponse } = await useFetch(`${urlApi}/api/contact?${populate}`)

const contact = computed(() => contactResponse.value?.data)

useSeoMeta({
  title: 'Контакты — Bitox',
  description:
    'Официальные аккаунты, контакты и офисы Bitox. Проверьте менеджера, свяжитесь с нами и найдите ближайший офис.',
})
</script>
