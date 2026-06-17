<template>
  <section v-if="sections.length" class="exchange-seo-sec">
    <div class="container">
      <article
        v-for="item in sections"
        :key="item.id"
        class="exchange-seo-sec__block"
      >
        <h2 v-if="item.title" class="exchange-seo-sec__title">{{ item.title }}</h2>
        <p v-if="item.text" class="exchange-seo-sec__text">{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  sections: {
    type: Array,
    default: () => [],
  },
})
</script>
