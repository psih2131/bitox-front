<template>
  <article class="blog-post-card">
    <NuxtLink :to="{
      path: `/blog/${postData.slug}`,
      query: { id: postData.documentId },
    }" class="blog-post-card__link">
      <div class="blog-post-card__media">
        <img
          :src="`${apiUrl}${postData.post_image.url}`"
          alt=""
          class="blog-post-card__img"
        />

        <div v-if="postData.category?.name" class="blog-post-card__tags">
          <span
            class="blog-post-card__tag"
          >
            {{ postData.category.name }}
          </span>
        </div>
      </div>
      

      <div class="blog-post-card__body">
        <p class="blog-post-card__date">{{ formatDate(postData.publishedAt) }}</p>
        <h3 class="blog-post-card__title" v-if="postData.post_title" v-html="postData.post_title"></h3>
        <p class="blog-post-card__text" v-if="postData.post_description" v-html="postData.post_description"></p>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup>
import { formatDate } from '~/utils/formatDate'

const apiUrl = useRuntimeConfig().public.apiUrl
defineProps({
  postData: {
    type: Object,
    required: true,
  },
})
</script>
