<template>
  <section ref="sectionRef" class="blog-category-sec">
    <div class="container">
      <h2 class="blog-category-sec__title">{{ title }}</h2>

      <div class="blog-category-sec__grid">
        <BlogPostCard
          v-for="post in posts"
          :key="post.id"
          :postData="post"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import BlogPostCard from '~/components/BlogPostCard.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  posts: {
    type: Array,
    required: true,
  },
})

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.blog-category-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.blog-post-card', {
      opacity: 0,
      y: 28,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
