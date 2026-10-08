<template>
  <section class="platform-sec">
    <div class="container">
      <h2 class="platform-sec__title" v-if="sectionTitle">
        {{ sectionTitle }}
      </h2>

      <div class="platform-sec__grid">
        <article class="platform-sec__card">
          <div class="platform-sec__card-head">
            <div class="platform-sec__card-text">
              <h3 class="platform-sec__card-title">{{ col1Title }}</h3>
              <p v-if="col1Subtitle" class="platform-sec__card-subtitle">
                {{ col1Subtitle }}
              </p>
            </div>

            <img
              :src="col1Img"
              :alt="col1Title"
              class="platform-sec__card-img"
              loading="lazy"
            />
          </div>

          <ul v-if="businessPages.length" class="platform-sec__list">
            <li v-for="page in businessPages" :key="page.id">
              <NuxtLink :to="page.link" class="platform-sec__item">
                <div class="platform-sec__item-content">
                  <p class="platform-sec__item-title">{{ page.title }}</p>
                  <p v-if="page.subtitle" class="platform-sec__item-text">{{ page.subtitle }}</p>
                </div>

                <span class="platform-sec__item-btn" aria-hidden="true">
                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--default"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--hover"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </article>

        <article class="platform-sec__card">
          <div class="platform-sec__card-head">
            <div class="platform-sec__card-text">
              <h3 class="platform-sec__card-title">{{ col2Title }}</h3>
              <p v-if="col2Subtitle" class="platform-sec__card-subtitle">
                {{ col2Subtitle }}
              </p>
            </div>

            <img
              :src="col2Img"
              :alt="col2Title"
              class="platform-sec__card-img"
              loading="lazy"
            />
          </div>

          <ul v-if="individualsPages.length" class="platform-sec__list">
            <li v-for="page in individualsPages" :key="page.id">
              <NuxtLink :to="page.link" class="platform-sec__item">
                <div class="platform-sec__item-content">
                  <p class="platform-sec__item-title">{{ page.title }}</p>
                  <p v-if="page.subtitle" class="platform-sec__item-text">{{ page.subtitle }}</p>
                </div>

                <span class="platform-sec__item-btn" aria-hidden="true">
                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--default"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--hover"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getStrapiMediaUrl, mapStrapiBusinessPages, mapStrapiIndividualsPages } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const sectionTitle = computed(
  () => props.section?.section_title || null,
)
const col1Title = computed(() => props.section?.col_1_title || null)
const col1Subtitle = computed(
  () => props.section?.col_1_subtitle || null,
)
const col2Title = computed(() => props.section?.col_2_title || null)
const col2Subtitle = computed(
  () => props.section?.col_2_subtitle || null,
)
const col1Img = computed(() => getStrapiMediaUrl(props.section?.col_1_img, urlApi) || '')
const col2Img = computed(() => getStrapiMediaUrl(props.section?.col_2_img, urlApi) || '')

const [{ data: businessPagesResponse }, { data: individualsPagesResponse }] = await Promise.all([
  useFetch(
    `${urlApi}/api/business-pages?fields[0]=title&fields[1]=slug&fields[2]=subtitle&populate=preview_image&pagination[pageSize]=100`,
  ),
  useFetch(
    `${urlApi}/api/individuals-pages?fields[0]=title&fields[1]=slug&fields[2]=subtitle&populate=preview_image&pagination[pageSize]=100`,
  ),
])

// Карточки из админки (Home → home_platform_sec → col_1_links / col_2_links)
function mapPlatformLinks(links) {
  return links
    .filter((item) => item?.title && item?.link)
    .map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.text,
      link: item.link,
    }))
}

const businessPages = computed(() => {
  const links = props.section?.col_1_links
  if (Array.isArray(links)) return mapPlatformLinks(links)

  return mapStrapiBusinessPages(businessPagesResponse.value?.data ?? [], urlApi)
    .map((page) => ({ ...page, link: `/business/${page.slug}` }))
})

const individualsPages = computed(() => {
  const links = props.section?.col_2_links
  if (Array.isArray(links)) return mapPlatformLinks(links)

  return mapStrapiIndividualsPages(individualsPagesResponse.value?.data ?? [], urlApi)
    .map((page) => ({ ...page, link: `/individuals/${page.slug}` }))
})

</script>
