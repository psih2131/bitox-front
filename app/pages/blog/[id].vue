<template>
  <main class="blog-post-page">
    <BlogPostHeroSec v-if="postData?.data" :post="postData.data" :views="views" />
    <BlogPostArticleSec v-if="postData?.data" :post="postData.data" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import BlogPostHeroSec from '~/components/sections/BlogPostHeroSec.vue'
import BlogPostArticleSec from '~/components/sections/BlogPostArticleSec.vue'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const postId = computed(() => route.query.id)
const { views } = usePostViews(postId)

const populate = [
  'populate[post_image]=true',
  'populate[category]=true',
  'populate[author]=true',
  'populate[post_content_builder]=true',
  'populate[post_questions_section][populate]=post_questions',
  'populate[seo_cluster]=true',
].join('&')

const { data: postData } = await useFetch(
  () => `${urlApi}/api/blog/${postId.value}?${populate}`,
  { watch: [postId] },
)

</script>
