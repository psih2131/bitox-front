<template>
  <aside class="blog-post-sidebar blog-post-sidebar--author-only">
    <div class="blog-post-sidebar__author-wrap">
      <div class="blog-post-sidebar__author-card">
        <img
          :src="avatarUrl"
          :alt="author.name || ''"
          class="blog-post-sidebar__avatar"
        />

        <div class="blog-post-sidebar__author-main">
          <p class="blog-post-sidebar__name">{{ author.name }}</p>
          <p v-if="author.position" class="blog-post-sidebar__position">{{ author.position }}</p>

          <div class="blog-post-sidebar__stats">
            <span class="blog-post-sidebar__stat">
              <span class="blog-post-sidebar__stat-icon" aria-hidden="true">🕒</span>
              {{ readTime }}
            </span>
          </div>
        </div>
      </div>

      <ul v-if="author.verified_author || author.about_autor" class="blog-post-sidebar__meta">
        <li v-if="author.verified_author">Проверенный автор</li>
        <li v-if="author.about_autor">{{ author.about_autor }}</li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import authorAvatar from '~/assets/images/team/team-member-1-227797.png'

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

// Фото автора из админки; если не загружено — стандартная аватарка
const avatarUrl = computed(() => {
  const media = props.author?.avatar
  const url = media?.formats?.thumbnail?.url || media?.formats?.small?.url || media?.url
  if (!url) return authorAvatar
  return url.startsWith('http') ? url : `${urlApi}${url}`
})

// «5» → «5 мин чтения»; если в админке уже написан текст — выводим как есть
const readTime = computed(() => {
  const value = String(props.timeToRead || '5').trim()
  return /^\d+$/.test(value) ? `${value} мин чтения` : value
})
</script>
