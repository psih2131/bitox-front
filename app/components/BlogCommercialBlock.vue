<template>
  <div class="blog-commercial" :class="`blog-commercial--${block.theme === 'dark' ? 'dark' : 'light'}`">
    <div class="blog-commercial__top" :class="{ 'blog-commercial__top--with-image': imageUrl }">
      <div class="blog-commercial__content">
        <p class="blog-commercial__title">{{ block.title }}</p>
        <p v-if="block.text" class="blog-commercial__text">{{ block.text }}</p>
      </div>

      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
        class="blog-commercial__img"
        loading="lazy"
      />
    </div>

    <div v-if="links.length || showTelegram" class="blog-commercial__buttons">
      <template v-for="item in links" :key="item.id">
        <NuxtLink v-if="item.internal" :to="item.href" class="blog-commercial__btn">
          {{ item.label }} <span aria-hidden="true">→</span>
        </NuxtLink>
        <a v-else :href="item.href" class="blog-commercial__btn" target="_blank" rel="noopener">
          {{ item.label }} <span aria-hidden="true">→</span>
        </a>
      </template>

      <button
        v-if="showTelegram"
        type="button"
        class="blog-commercial__btn blog-commercial__btn--tg"
        @click="openTelegramBot"
      >
        {{ block.telegram_button_label || 'Консультация в Telegram' }}
        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M14.725 0.466725L12.3958 12.6265C12.3958 12.6265 12.0699 13.4696 11.1746 13.0653L5.80055 8.79825L5.77563 8.78567C6.50154 8.11068 12.1306 2.86956 12.3766 2.63199C12.7575 2.26406 12.521 2.04502 12.0788 2.32295L3.76401 7.79105L0.55617 6.67334C0.55617 6.67334 0.0513494 6.48739 0.00278445 6.08306C-0.0464195 5.67806 0.572784 5.45902 0.572784 5.45902L13.6502 0.146434C13.6502 0.146434 14.725 -0.342604 14.725 0.466725Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl
const { $TgAnalitika } = useNuxtApp()

const imageUrl = computed(() => {
  const media = props.block.image
  if (!media) return null
  const url = media.formats?.small?.url || media.formats?.medium?.url || media.url
  if (!url) return null
  return url.startsWith('http') ? url : `${apiUrl}${url}`
})

const showTelegram = computed(() => props.block.show_telegram_button !== false)

// Ссылки на свой сайт открываем внутри сайта, на чужие — в новой вкладке
const links = computed(() =>
  (props.block.buttons ?? [])
    .filter((item) => item?.label && item?.link)
    .map((item) => {
      let href = item.link.trim()
      const own = href.match(/^https?:\/\/(www\.)?bitox\.global(\/.*)?$/i)
      if (own) href = own[2] || '/'
      return { id: item.id, label: item.label, href, internal: href.startsWith('/') }
    }),
)

async function openTelegramBot() {
  // Окно открываем сразу по клику, иначе браузер может заблокировать его как всплывающее
  const tab = window.open('', '_blank')
  const result = await $TgAnalitika.trackEvent()
  const link = result?.data?.link

  if (tab && link) tab.location.href = link
  else if (link) window.open(link, '_blank')
  else tab?.close()
}
</script>
