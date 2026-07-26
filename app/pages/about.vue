<template>
  <main class="about-page">
    <AboutHeroSec v-if="about?.section_1__hero" :section="about.section_1__hero" />
    <AboutCompanySec v-if="about?.about_text_sec" :section="about.about_text_sec" />
    <!-- <HomeTeamSec v-if="about?.about_team_sec" :section="about.about_team_sec" /> -->
    <AboutLifeSec v-if="about?.about_gallery_sec" :section="about.about_gallery_sec" />
    <AboutContactsSec v-if="about?.about_contacts_sec" :section="about.about_contacts_sec" />
    <AboutOfficesSec v-if="about?.about_offices_sec" :section="about.about_offices_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
const urlApi = useRuntimeConfig().public.apiUrl

const populate = [
  'populate[section_1__hero][populate][box_list_element]=true',
  'populate[section_1__hero][populate][image]=true',
  'populate[about_text_sec][populate]=section_image',
  'populate[about_team_sec]=true',
  'populate[about_contacts_sec]=true',
  'populate[about_gallery_sec][populate][img_gallery][populate]=image',
  'populate[about_offices_sec][populate][offices_map_image]=true',
  'populate[about_offices_sec][populate][offices_list]=true',
].join('&')

const { data: aboutResponse } = await useFetch(`${urlApi}/api/about?${populate}`)

const about = computed(() => aboutResponse.value?.data)

useSeoMeta({
  title: 'О Bitox — Bitox',
  description:
    'О компании Bitox: цифры, команда, офисы и контакты. Международные расчёты и обмен криптовалюты для бизнеса и частных клиентов.',
})
</script>
