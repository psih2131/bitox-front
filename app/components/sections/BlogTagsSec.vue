<template>
  <section ref="sectionRef" class="blog-tags-sec">
    <div class="container">
      <nav class="blog-tags-sec__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="blog-tags-sec__breadcrumb-link">Главная</NuxtLink>
        <span class="blog-tags-sec__breadcrumb-sep">/</span>
        <span class="blog-tags-sec__breadcrumb-current">Блог</span>
      </nav>

      <h1 class="blog-tags-sec__title">Что вам интересно</h1>

      <div class="blog-tags-sec__grid" role="list">
        <button
          v-for="tag in tags"
          :key="tag.id"
          type="button"
          class="blog-tags-sec__tag"
          :class="{ 'blog-tags-sec__tag--active': activeTag === tag.id }"
          role="listitem"
          @click="activeTagFunction(tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const emit = defineEmits(['activeTag'])

const sectionRef = ref(null)
const activeTag = ref(null)

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

const tags = props.categories

let sectionAnimation

function activeTagFunction(tagId) {
  activeTag.value = activeTag.value === tagId ? null : tagId
  emit('activeTag', activeTag.value)
}

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.blog-tags-sec__breadcrumbs', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: 'power2.out',
    })

    gsap.from('.blog-tags-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.blog-tags-sec__tag', {
      opacity: 0,
      y: 16,
      duration: 0.45,
      stagger: 0.04,
      delay: 0.2,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
