<template>
  <article class="blog-post-card">
    <NuxtLink :to="to" class="blog-post-card__link">
      <div class="blog-post-card__media">
        <img
          :src="image"
          alt=""
          class="blog-post-card__img"
        />

        <div v-if="tags.length" class="blog-post-card__tags">
          <span
            v-for="tag in tags"
            :key="tag"
            class="blog-post-card__tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="blog-post-card__body">
        <p class="blog-post-card__date">{{ date }}</p>
        <h3 class="blog-post-card__title">{{ title }}</h3>
        <p class="blog-post-card__text">{{ text }}</p>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>
