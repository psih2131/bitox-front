<template>
  <main v-if="businessPage" class="service-page">

    <ServiceHeroSec v-if="businessPage.service_hero_sec" :section="businessPage.service_hero_sec" />

    <HomeStatsSec />

    <ServiceInvoicesSec v-if="businessPage.services_invoice_sec" :section="businessPage.services_invoice_sec" />

    <ServiceEconomySec />
    <HomeChoiceSec />
    <HomeBenefitsSec />

    <BusinessCountriesSec
      v-if="invoices.length"
      :title="businessPage.service_county_sec_v2?.title_section"
      :countries="invoices"
    />

    <BusinessOtherSec />

    <ServiceExamplesSec
      v-if="businessPage.services_invoice_example_sec"
      :section="businessPage.services_invoice_example_sec"
    />

    <HomeReviewsSec />

    <HomeMediaSec v-if="businessPage.service_media_about_us_sec" :section="businessPage.service_media_about_us_sec" />

    <HomeFaqSec v-if="businessPage.services_faq_sec" :section="businessPage.services_faq_sec" />

    <ServiceContactSec />
  </main>
</template>

<script setup>
import { buildStrapiSlugFilter, mapStrapiInvoices, STRAPI_SEO_POPULATE_PARTS } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const slug = computed(() => route.params.id)

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

const { data: businessPageResponse } = await useFetch(
  () => (slug.value ? `${urlApi}/api/business-pages?${buildStrapiSlugFilter(slug.value)}&${populate}` : null),
  { watch: [slug] },
)

const { data: invoicesResponse } = await useFetch(
  `${urlApi}/api/invoices?fields[0]=title&fields[1]=slug&populate=flag&pagination[pageSize]=100`,
)

const businessPage = computed(() => businessPageResponse.value?.data?.[0])

const invoices = computed(() =>
  mapStrapiInvoices(invoicesResponse.value?.data ?? [], urlApi),
)

if (!slug.value || !businessPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

useStrapiSeo(businessPage.value.Seo, { apiUrl: urlApi })
</script>
