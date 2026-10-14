<template>
  <section ref="sectionRef" class="blog-post-article-sec">
    <div class="container blog-post-article-sec__inner">
      <div class="blog-post-article-sec__content">
        <div class="blog-post-article-sec__body">
          <div
            v-for="block in post.post_content_builder"
            :id="block.id_for_section"
            :key="block.id"
            class="blog-post-article-sec__cluster"
            :class="{ 'blog-post-article-sec__cluster--callout': block.__component === 'shared.quote-text' }"
          >
            <div
              v-if="block.__component === 'shared.text-editor'"
              class="text-editor"
              v-html="renderMarkdown(block.text_editor)"
            />

            <div
              v-else-if="block.__component === 'shared.quote-text'"
              class="text-editor"
              v-html="renderMarkdown(block.quote_text_element)"
            />

            <BlogCommercialBlock
              v-else-if="block.__component === 'shared.commercial-block'"
              :block="block"
            />
          </div>
        </div>

        <div v-if="post.post_questions_section" class="blog-post-article-sec__faq">
          <h2 class="blog-post-article-sec__faq-title">{{ post.post_questions_section.title_section }}</h2>

          <div
            v-if="post.post_questions_section.post_questions?.length"
            class="blog-post-article-sec__faq-list"
          >
            <FaqItem
              v-for="item in post.post_questions_section.post_questions"
              :key="item.id"
              :question="item.title"
              :answer="item.text"
            />
          </div>
        </div>
        <div v-if="sources.length" class="blog-post-article-sec__sources">
          <p class="blog-post-article-sec__sources-title">Источники</p>
          <ol class="blog-post-article-sec__sources-list">
            <li v-for="item in sources" :key="item.id" class="blog-post-article-sec__sources-item">
              <a :href="item.url" target="_blank" rel="noopener" class="blog-post-article-sec__sources-link">{{ item.title }}</a>
            </li>
          </ol>
        </div>
      </div>

      <BlogPostTocSidebar
        class="blog-post-article-sec__sidebar blog-post-article-sec__sidebar--sticky"
        :data-toc="tocItems"
      />
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import MarkdownIt from 'markdown-it';
import BlogCommercialBlock from '~/components/BlogCommercialBlock.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

// В оглавление попадают только разделы с названием (коммерческие блоки — нет)
const tocItems = computed(() =>
  (props.post.post_content_builder ?? []).filter((block) => block.section_title_for_nav_post_menu),
)
// Источники в конце статьи (законы, ЦБ, налоговая и т. п.)
const sources = computed(() =>
  (props.post.post_sources ?? []).filter((item) => item?.title && item?.url),
)

const md = new MarkdownIt();

function renderMarkdown(text) {
    if (!text) {
        return '';
    }

    return md.render(text);
}


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
