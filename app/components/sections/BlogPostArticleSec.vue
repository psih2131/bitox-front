<template>
  <section ref="sectionRef" class="blog-post-article-sec">
    <div class="container blog-post-article-sec__inner">
      <div class="blog-post-article-sec__content">
        <div class="blog-post-article-sec__body">
          <div
            v-for="cluster in post.contentClusters"
            :key="cluster.id"
            class="blog-post-article-sec__cluster"
            :class="{ 'blog-post-article-sec__cluster--callout': cluster.variant === 'callout' }"
          >
            <div
              class="text-editor"
              v-html="cluster.html"
            />
          </div>
        </div>

        <div class="blog-post-article-sec__faq">
          <h2 class="blog-post-article-sec__faq-title">{{ post.faqTitle }}</h2>

          <div class="blog-post-article-sec__faq-list">
            <FaqItem
              v-for="item in post.faq"
              :key="item.id"
              :question="item.question"
              :answer="item.answer"
            />
          </div>
        </div>
      </div>

      <BlogPostSidebar
        class="blog-post-article-sec__sidebar blog-post-article-sec__sidebar--sticky"
        :author="post.author"
        :updated-at="post.updatedAt"
        :toc="post.toc"
        :show-author="false"
      />
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
    gsap.from('.blog-post-article-sec__cluster', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
