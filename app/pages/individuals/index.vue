<template>
  <main v-if="individualsPage" class="service-page">
    <ServiceHeroSec v-if="individualsPage.service_hero_sec" :section="individualsPage.service_hero_sec" />
    <CryptoExchangeCalcSec :countryName="individualsPage.title" />
    <HomeStatsSec />
    <ServiceInvoicesSec v-if="individualsPage.services_invoice_sec" :section="individualsPage.services_invoice_sec" />
    <ServiceEconomySec />
    <HomeChoiceSec />
    <HomeBenefitsSec />
    <BusinessCountriesSec
      v-if="transfersPages.length"
      :title="individualsPage.service_county_sec_v2?.title_section"
      :countries="transfersPages"
      link-base="/transfers"
    />
    <BusinessOtherSec />
    <ServiceExamplesSec
      v-if="individualsPage.services_invoice_example_sec"
      :section="individualsPage.services_invoice_example_sec"
    />
    <HomeReviewsSec />
    <HomeMediaSec v-if="individualsPage.service_media_about_us_sec" :section="individualsPage.service_media_about_us_sec" />
    <HomeFaqSec v-if="individualsPage.services_faq_sec" :section="individualsPage.services_faq_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { mapStrapiInvoices, STRAPI_SEO_POPULATE_PARTS } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const populate = [
  'populate[service_hero_sec][populate]=image',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_image]=true',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_element_list_items]=true',
  'populate[service_county_sec_v2]=true',
  'populate[services_invoice_example_sec][populate][examples_items][populate][blog][populate]=post_image',
  'populate[service_media_about_us_sec][populate][posts][populate]=logo',
  'populate[services_faq_sec][populate]=questions_list',
  ...STRAPI_SEO_POPULATE_PARTS,
].join('&')

const [{ data: individualsSinglResponse }, { data: transfersPagesResponse }] = await Promise.all([
  useFetch(`${urlApi}/api/individuals-singl?${populate}`),
  useFetch(
    `${urlApi}/api/transfers-pages?fields[0]=title&fields[1]=slug&populate=flag&pagination[pageSize]=100`,
  ),
])

const individualsPage = computed(() => individualsSinglResponse.value?.data)

const transfersPages = computed(() =>
  mapStrapiInvoices(transfersPagesResponse.value?.data ?? [], urlApi),
)

if (!individualsSinglResponse.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

useStrapiSeo(individualsSinglResponse.value.data.Seo, { apiUrl: urlApi })
</script>
