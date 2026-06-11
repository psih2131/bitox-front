<template>
  <aside
    class="blog-post-sidebar"
    :class="{
      'blog-post-sidebar--author-only': showAuthor && !showToc,
      'blog-post-sidebar--toc-only': showToc && !showAuthor,
    }"
  >
    <div v-if="showAuthor" class="blog-post-sidebar__author-wrap">
      <div class="blog-post-sidebar__author-card">
        <img
          :src="author.avatar"
          alt=""
          class="blog-post-sidebar__avatar"
        />

        <div class="blog-post-sidebar__author-main">
          <h3 class="blog-post-sidebar__name">{{ author.name }}</h3>

          <div class="blog-post-sidebar__stats">
            <span class="blog-post-sidebar__stat">
              <span class="blog-post-sidebar__stat-icon" aria-hidden="true">👁</span>
              {{ author.rating }}
            </span>
            <span class="blog-post-sidebar__stat">
              <span class="blog-post-sidebar__stat-icon" aria-hidden="true">🕒</span>
              {{ author.readTime }}
            </span>
          </div>
        </div>
      </div>

      <ul class="blog-post-sidebar__meta">
        <li>{{ author.verified }}</li>
        <li>{{ author.role }}</li>
        <li>Дата обновления: {{ updatedAt }}</li>
      </ul>
    </div>

    <div v-if="showToc" class="blog-post-sidebar__toc">
      <h4 class="blog-post-sidebar__toc-title">В статье расскажем</h4>

      <ul class="blog-post-sidebar__toc-list">
        <li
          v-for="item in toc"
          :key="item"
          class="blog-post-sidebar__toc-item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  author: {
    type: Object,
    default: null,
  },
  updatedAt: {
    type: String,
    default: '',
  },
  toc: {
    type: Array,
    default: () => [],
  },
  showAuthor: {
    type: Boolean,
    default: true,
  },
  showToc: {
    type: Boolean,
    default: true,
  },
})
</script>
