<template>
  <div
    class="text-content-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="text-content-modal-title"
  >
    <button
      type="button"
      class="text-content-modal__close"
      aria-label="Закрыть"
      @click="modalStore.close()"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <h2
      v-if="title"
      id="text-content-modal-title"
      class="text-content-modal__title"
    >
      {{ title }}
    </h2>

    <div class="text-content-modal__body blog-post-article-sec__cluster">
      <div class="text-editor" v-html="formattedContent" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '~/stores/modal'
import { renderRichText } from '~/utils/formatBlogText'

const modalStore = useModalStore()
const { payload } = storeToRefs(modalStore)

const title = computed(() => payload.value?.title || '')
const formattedContent = computed(() => renderRichText(payload.value?.content || ''))
</script>
