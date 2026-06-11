<template>
  <main class="blog-page">
    <BlogTagsSec />

    <BlogCategorySec
      title="Бизнесу"
      :posts="businessPosts"
    />

    <BlogCategorySec
      title="Частным лицам"
      :posts="individualPosts"
    />

    <BlogCategorySec
      title="Новости"
      :posts="newsPosts"
    />

    <ServiceContactSec />
  </main>
</template>

<script setup>
import { getBlogListPosts } from '~/data/blog-posts'

useSeoMeta({
  title: 'Блог — Bitox',
  description: 'Статьи и новости Bitox о международных платежах, криптовалюте и финансовых решениях для бизнеса и частных клиентов.',
})

const blogSections = getBlogListPosts()
const businessPosts = blogSections[0].posts
const individualPosts = blogSections[1].posts
const newsPosts = blogSections[2].posts
</script>
