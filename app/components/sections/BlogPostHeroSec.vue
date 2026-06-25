<template>
  <section ref="sectionRef" class="blog-post-hero-sec">
    <div class="container">
      <nav class="blog-post-hero-sec__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="blog-post-hero-sec__breadcrumb-link">Главная</NuxtLink>
        <span class="blog-post-hero-sec__breadcrumb-sep">/</span>
        <NuxtLink to="/blog" class="blog-post-hero-sec__breadcrumb-link">Блог</NuxtLink>
        <span class="blog-post-hero-sec__breadcrumb-sep">/</span>
        <span
          v-if="post.post_title"
          class="blog-post-hero-sec__breadcrumb-current"
        >{{ truncateText(post.post_title) }}</span>
      </nav>

      <div class="blog-post-hero-sec__head">
        <div class="blog-post-hero-sec__main">
          <div class="blog-post-hero-sec__meta">
            <span class="blog-post-hero-sec__date" v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
          </div>

          <h1 class="blog-post-hero-sec__title" v-if="post.post_title" v-html="post.post_title"></h1>
        </div>

        <BlogPostAuthorSidebar
          v-if="post.author"
          class="blog-post-hero-sec__author"
          :author="post.author"
          :updated-at="post.updatedAt"
          :time-to-read="post.time_read_post"
        />
      </div>

      <div class="blog-post-hero-sec__bottom">
        <img
          alt=""
          class="blog-post-hero-sec__image"
          :src="`${apiUrl}${post.post_image.url}`"
        />

        <BlogPostTocSidebar
          class="blog-post-hero-sec__toc"
          :data-toc="post.post_content_builder"
        />
      </div>
    </div>
  </section>
</template>

<script setup>

defineProps({
  post: {
    type: Object,
    required: true,
  },
})

import gsap from 'gsap'
import { formatDate } from '~/utils/formatDate'
import { truncateText } from '~/utils/truncateText'
const apiUrl = useRuntimeConfig().public.apiUrl
const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.blog-post-hero-sec__breadcrumbs', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: 'power2.out',
    })

    gsap.from('.blog-post-hero-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.blog-post-hero-sec__image', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
