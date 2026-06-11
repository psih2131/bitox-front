<template>
  <main class="blog-post-page">
    <BlogPostHeroSec :post="post" />
    <BlogPostArticleSec :post="post" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { getBlogPostById } from '~/data/blog-posts'

const route = useRoute()
const post = computed(() => getBlogPostById(String(route.params.id)))

useSeoMeta({
  title: () => `${post.value.title} — Bitox`,
  description: () => post.value.excerpt || post.value.title,
})
</script>
