<template>
  <aside class="blog-post-sidebar blog-post-sidebar--toc-only">
    <div class="blog-post-sidebar__toc">
      <h4 class="blog-post-sidebar__toc-title">В статье расскажем</h4>

      <ul class="blog-post-sidebar__toc-list" v-if="dataToc?.length > 0">
        <li
          v-for="item in dataToc"
          :key="item.id"
          class="blog-post-sidebar__toc-item"
        >
          <a
            v-if="item.id_for_section"
            :href="`#${item.id_for_section}`"
            class="blog-post-sidebar__toc-link"
          >
            {{ item.section_title_for_nav_post_menu }}
          </a>
          <span v-else>{{ item.section_title_for_nav_post_menu }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  dataToc: {
    type: Array,
    default: () => [],
  },
})



</script>
