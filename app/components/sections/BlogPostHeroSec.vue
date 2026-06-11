<template>
  <section ref="sectionRef" class="blog-post-hero-sec">
    <div class="container">
      <nav class="blog-post-hero-sec__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="blog-post-hero-sec__breadcrumb-link">Главная</NuxtLink>
        <span class="blog-post-hero-sec__breadcrumb-sep">/</span>
        <NuxtLink to="/blog" class="blog-post-hero-sec__breadcrumb-link">Блог</NuxtLink>
        <span class="blog-post-hero-sec__breadcrumb-sep">/</span>
        <span class="blog-post-hero-sec__breadcrumb-current">Статья</span>
      </nav>

      <div class="blog-post-hero-sec__head">
        <div class="blog-post-hero-sec__main">
          <div class="blog-post-hero-sec__meta">
            <span class="blog-post-hero-sec__date">{{ post.date }}</span>

            <span class="blog-post-hero-sec__stat">
              <span class="blog-post-hero-sec__stat-icon" aria-hidden="true">♡</span>
              {{ post.views }}
            </span>

            <span class="blog-post-hero-sec__stat">
              <span class="blog-post-hero-sec__stat-icon" aria-hidden="true">💬</span>
              {{ post.comments }}
            </span>

            <span class="blog-post-hero-sec__stat">
              <span class="blog-post-hero-sec__stat-icon" aria-hidden="true">🔖</span>
              {{ post.likes }}
            </span>
          </div>

          <h1 class="blog-post-hero-sec__title">{{ post.title }}</h1>
        </div>

        <BlogPostSidebar
          class="blog-post-hero-sec__author"
          :author="post.author"
          :updated-at="post.updatedAt"
          :toc="post.toc"
          :show-toc="false"
        />
      </div>

      <div class="blog-post-hero-sec__bottom">
        <img
          :src="post.image"
          alt=""
          class="blog-post-hero-sec__image"
        />

        <BlogPostSidebar
          class="blog-post-hero-sec__toc"
          :author="post.author"
          :updated-at="post.updatedAt"
          :toc="post.toc"
          :show-author="false"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

defineProps({
  post: {
    type: Object,
    required: true,
  },
})

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
