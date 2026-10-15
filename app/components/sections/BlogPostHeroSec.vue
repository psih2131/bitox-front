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
        >{{ truncateText(post.post_title, 300) }}</span>
      </nav>

      <div class="blog-post-hero-sec__head">
        <div class="blog-post-hero-sec__main">
          <h1 class="blog-post-hero-sec__title" v-if="post.post_title" v-html="post.post_title"></h1>

          <div class="blog-post-hero-sec__info">
            <span class="blog-post-hero-sec__info-item">
              <span aria-hidden="true">🕒</span> {{ readTime }}
            </span>
            <template v-if="shownDate">
              <span class="blog-post-hero-sec__info-dot" aria-hidden="true">·</span>
              <span class="blog-post-hero-sec__info-item">
                {{ shownDate.label }}: <time :datetime="shownDate.value">{{ formatPostDate(shownDate.value) }}</time>
              </span>
            </template>
          </div>
        </div>

        <BlogPostAuthorSidebar
          v-if="post.author"
          class="blog-post-hero-sec__author"
          :author="post.author"
          :updated-at="updatedDate || ''"
          :time-to-read="post.time_read_post"
        />
      </div>

      <div class="blog-post-hero-sec__bottom">
        <img
          alt=""
          class="blog-post-hero-sec__image"
          :src="`${apiUrl}${post.post_image.url}`"
        />

        <!-- <BlogPostTocSidebar
          class="blog-post-hero-sec__toc"
          :data-toc="post.post_content_builder"
        /> -->
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const publishedDate = computed(() => getPostPublishedDate(props.post))
const updatedDate = computed(() => getPostUpdatedDate(props.post))

// Одна дата: если статью обновляли — дата обновления, иначе — дата публикации
const shownDate = computed(() => {
  if (updatedDate.value) return { label: 'Обновлено', value: updatedDate.value }
  if (publishedDate.value) return { label: 'Опубликовано', value: publishedDate.value }
  return null
})

// «5» → «5 мин чтения»; если в админке уже написан текст — выводим как есть
const readTime = computed(() => {
  const value = String(props.post.time_read_post || '5').trim()
  return /^\d+$/.test(value) ? `${value} мин чтения` : value
})

import gsap from 'gsap'
import { formatPostDate, getPostPublishedDate, getPostUpdatedDate } from '~/utils/postDates'
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
