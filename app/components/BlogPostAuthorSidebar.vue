<template>
  <aside class="blog-post-sidebar blog-post-sidebar--author-only">
    <div class="blog-post-sidebar__author-wrap">
      <div class="blog-post-sidebar__author-card">
        <img
          :src="`${urlApi}${authorData.data.avatar.url}` || authorAvatar"
          alt=""
          class="blog-post-sidebar__avatar"
        />

        <div class="blog-post-sidebar__author-main">
          <h3 class="blog-post-sidebar__name">{{ author.name }}</h3>

          <div class="blog-post-sidebar__stats">
            <span class="blog-post-sidebar__stat">
              <span class="blog-post-sidebar__stat-icon" aria-hidden="true">🕒</span>
              {{ timeToRead || '5 мин чтения' }}
            </span>
          </div>
        </div>
      </div>

      <ul class="blog-post-sidebar__meta">
        <li v-if="author?.verified_author">Проверенный автор</li>
        <li v-if="author?.about_autor">{{ author.about_autor }}</li>
        <li v-if="updatedAt">Дата обновления: {{ formatDate(updatedAt) }}</li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import authorAvatar from '~/assets/images/team/team-member-1-227797.png'

import { formatDate } from '~/utils/formatDate'

const urlApi = useRuntimeConfig().public.apiUrl

const props = defineProps({
  author: {
    type: Object,
    default: null,
  },
  updatedAt: {
    type: String,
    default: '',
  },
  timeToRead: {
    type: String,
    default: '',
  },
})

const {data: authorData} = await useFetch(`${urlApi}/api/authors/${props.author.documentId}?populate=avatar`)
</script>
