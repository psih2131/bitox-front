<template>
  <main v-if="transfersPage" class="service-page">
    <!-- <ServiceHeroSec v-if="transfersPage.service_hero_sec" :section="transfersPage.service_hero_sec" /> -->

    <InvoiceHeroSec v-if="transfersPage.service_hero_sec" :section="transfersPage.service_hero_sec" :countryName="transfersPage.title_mutation || transfersPage.title"/>

    <!-- <CryptoExchangeCalcSec :countryName="transfersPage.title" /> -->

    <TransferStatsSec :countryName="transfersPage.title_mutation || transfersPage.title" />

    <TransferFeaturesSec
      :country-name="transfersPage.title_mutation || transfersPage.title"
      :country-cities="transfersPage.country_cities"
    />

    <TransferProcessSec :country-name="transfersPage.title_mutation || transfersPage.title" />

    <ServiceInvoicesSec v-if="transfersPage.services_invoice_sec" :section="transfersPage.services_invoice_sec" />
    
    <ServiceEconomySec />
    
    <HomeChoiceSec />
    
    <HomeBenefitsSec />
    
    <BusinessCountriesSec
      v-if="transfersPages.length"
      :title="transfersPage.service_county_sec_v2?.title_section"
      :countries="transfersPages"
      link-base="/transfers"
    />
    <BusinessOtherSec />
    
    <ServiceExamplesSec
      v-if="transfersPage.services_invoice_example_sec"
      :section="transfersPage.services_invoice_example_sec"
    />
    <HomeReviewsSec />
    
    <HomeMediaSec v-if="transfersPage.service_media_about_us_sec" :section="transfersPage.service_media_about_us_sec" />
    
    <HomeFaqSec v-if="transfersPage.services_faq_sec" :section="transfersPage.services_faq_sec" />
    
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
  'populate[country_cities]=true',
  'populate[transfers_pages_region]=true',
  ...STRAPI_SEO_POPULATE_PARTS,
].join('&')

const { data: transfersPageResponse } = await useFetch(
  () => (slug.value ? `${urlApi}/api/transfers-pages?${buildStrapiSlugFilter(slug.value)}&${populate}` : null),
  { watch: [slug] },
)

const { data: transfersPagesResponse } = await useFetch(
  `${urlApi}/api/transfers-pages?fields[0]=title&fields[1]=slug&populate[0]=flag&populate[1]=transfers_pages_region&pagination[pageSize]=100`,
)

const transfersPage = computed(() => transfersPageResponse.value?.data?.[0])

function getTransfersRegionKey(item) {
  const region = item?.transfers_pages_region
  if (!region) return null
  return region.documentId || region.id || null
}

const transfersPages = computed(() => {
  const allPages = transfersPagesResponse.value?.data ?? []
  const current = transfersPage.value
  const currentRegionKey = getTransfersRegionKey(current)
  const currentKey = current?.documentId || current?.id || current?.slug

  let list = []

  for (let i = 0; i < allPages.length; i++) {
    const item = allPages[i]
    const itemKey = item.documentId || item.id || item.slug

    if (currentKey && itemKey === currentKey) continue
    if (current?.slug && item.slug === current.slug) continue

    list.push(item)
  }

  if (currentRegionKey) {
    const sameRegion = []

    for (let i = 0; i < list.length; i++) {
      if (getTransfersRegionKey(list[i]) === currentRegionKey) {
        sameRegion.push(list[i])
      }
    }

    if (sameRegion.length) {
      list = sameRegion
    }
  }

  return mapStrapiInvoices(list, urlApi)
})

if (!slug.value || !transfersPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

useStrapiSeo(transfersPage.value.Seo, { apiUrl: urlApi })
</script>
