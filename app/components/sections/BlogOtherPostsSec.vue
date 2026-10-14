<template>
  <section v-if="otherPosts.length" class="blog-other-posts-sec">
    <div class="container">
      <p class="blog-other-posts-sec__title">Другие статьи:</p>

      <div class="blog-other-posts-sec__grid">
        <NuxtLink
          v-for="item in otherPosts"
          :key="item.id"
          :to="`/blog/${item.slug}`"
          class="blog-other-posts-sec__card"
        >
          <div class="blog-other-posts-sec__media">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="blog-other-posts-sec__img"
              loading="lazy"
            />
          </div>
          <div class="blog-other-posts-sec__name">{{ item.title }}</div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { STRAPI_BLOG_POSTS_API } from '~/utils/strapi'

const props = defineProps({
  currentSlug: { type: String, required: true },
  categoryId: { type: [Number, String], default: null },
  limit: { type: Number, default: 4 },
})

const urlApi = useRuntimeConfig().public.apiUrl

const query = [
  `filters[slug][$ne]=${encodeURIComponent(props.currentSlug)}`,
  'fields[0]=post_title',
  'fields[1]=slug',
  'populate[post_image]=true',
  'populate[category][fields][0]=name',
  'sort=publishedAt:desc',
  'pagination[pageSize]=50',
].join('&')

const { data } = await useFetch(`${urlApi}${STRAPI_BLOG_POSTS_API}?${query}`, {
  key: `blog-other-posts-${props.currentSlug}`,
})

function imageUrl(media) {
  if (!media) return null
  const url = media.formats?.small?.url || media.formats?.medium?.url || media.url
  if (!url) return null
  return url.startsWith('http') ? url : `${urlApi}${url}`
}

const otherPosts = computed(() => {
  const list = data.value?.data ?? []
  const sameCategory = []
  const rest = []

  for (const post of list) {
    if (!post?.slug || !post?.post_title) continue
    const isSame = props.categoryId != null && post.category?.id != null && +post.category.id === +props.categoryId
    ;(isSame ? sameCategory : rest).push(post)
  }

  return [...sameCategory, ...rest].slice(0, props.limit).map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.post_title,
    image: imageUrl(post.post_image),
  }))
})
</script>
