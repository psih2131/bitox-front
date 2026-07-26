<template>
  <main class="home-page">
    <HomeHeroSec v-if="home?.home_hero_sec" :section="home.home_hero_sec" />

    <HomeStatsSec />

    <HomeOffersSec v-if="home?.home_offers_banners_sec" :section="home.home_offers_banners_sec" />

    <HomeChoiceSec />

    <HomePlatformSec :section="home?.home_platform_sec" />

    <HomeCountriesSec v-if="home?.home_countries_sec" :section="home.home_countries_sec" />

    <HomeBenefitsSec />

    <HomeReviewsSec />

    <HomeMediaSec v-if="home?.home_media_about_us" :section="home.home_media_about_us" />

    <!-- <HomeTeamSec v-if="home?.home_team_sec" :section="home.home_team_sec" /> -->

    <HomeHowStartSec v-if="home?.home_how_start_sec" :section="home.home_how_start_sec" />

    <HomeFaqSec v-if="home?.home_faq_sec" :section="home.home_faq_sec" />

    <HomeCtaSec v-if="home?.home_down_ctr_v1_sec" :section="home.home_down_ctr_v1_sec" />
  </main>
</template>

<script setup>
import { getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const populate = [
  'populate[home_hero_sec][populate]=home_hero_card_items',
  'populate[home_offers_banners_sec][populate][banners][populate]=banner_image',
  'populate[home_countries_sec]=true',
  'populate[home_platform_sec][populate][col_1_img]=true',
  'populate[home_platform_sec][populate][col_2_img]=true',
  'populate[home_media_about_us][populate][posts][populate]=logo',
  'populate[home_team_sec]=true',
  'populate[home_how_start_sec][populate][clusters][populate]=items',
  'populate[home_faq_sec][populate]=questions_list',
  'populate[home_down_ctr_v1_sec][populate]=image',
  'populate[Seo][populate]=shareImage',
].join('&')

const { data: homeResponse } = await useFetch(`${urlApi}/api/home?${populate}`)

const home = computed(() => homeResponse.value?.data)
const pageSeo = homeResponse.value?.data?.Seo

useSeoMeta({
  title: pageSeo?.metaTitle || 'Bitox',
  description: pageSeo?.metaDescription || 'Bitox',
  ogImage: getStrapiMediaUrl(pageSeo?.shareImage, urlApi) || undefined,
})
</script>
