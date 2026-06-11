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
import postImage from '~/assets/images/exm-1.jpg'

useSeoMeta({
  title: 'Блог — Bitox',
  description: 'Статьи и новости Bitox о международных платежах, криптовалюте и финансовых решениях для бизнеса и частных клиентов.',
})

const postExcerpt =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const createPosts = (prefix, count = 3) => Array.from({ length: count }, (_, index) => ({
  id: `${prefix}-${index + 1}`,
  to: `/blog/${prefix}-${index + 1}`,
  image: postImage,
  tags: ['Тег', 'Тег'],
  date: '11.11.2024',
  title: 'Как принимать оплату в USDT от иностранных клиентов в 2024 году',
  text: postExcerpt,
}))

const businessPosts = createPosts('business')
const individualPosts = createPosts('individual')
const newsPosts = createPosts('news')
</script>
