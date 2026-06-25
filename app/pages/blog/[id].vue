<template>
  <main class="blog-post-page">
    <BlogPostHeroSec v-if="post" :post="post" />
    <BlogPostArticleSec v-if="post" :post="post" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import BlogPostHeroSec from '~/components/sections/BlogPostHeroSec.vue'
import BlogPostArticleSec from '~/components/sections/BlogPostArticleSec.vue'
import { buildStrapiSlugFilter, getStrapiMediaUrl, getStrapiSeoPopulateParts } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const slug = computed(() => route.params.id)

const populate = [
  'populate[post_image]=true',
  'populate[category]=true',
  'populate[author]=true',
  'populate[post_content_builder]=true',
  'populate[post_questions_section][populate]=post_questions',
  ...getStrapiSeoPopulateParts('seo_cluster'),
].join('&')

const { data: postData } = await useFetch(
  () => (slug.value ? `${urlApi}/api/blog?${buildStrapiSlugFilter(slug.value)}&${populate}` : null),
  { watch: [slug] },
)

const post = computed(() => postData.value?.data?.[0])

if (!slug.value || !post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Статья не найдена',
  })
}

useStrapiSeo(post.value.seo_cluster, {
  apiUrl: urlApi,
  fallbackTitle: post.value.post_title || 'Bitox',
  fallbackDescription: post.value.post_description || 'Bitox',
  fallbackOgType: 'article',
  fallbackOgImage: getStrapiMediaUrl(post.value.post_image, urlApi) || undefined,
})
</script>
