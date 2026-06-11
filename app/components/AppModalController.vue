<template>
  <Teleport to="body">
    <div
      v-if="modalStore.popup.isOpen"
      class="modal-controller"
      @click.self="modalStore.close()"
    >
      <ConsultationModal
        v-if="modalStore.popup.name === MODAL_NAMES.consultation"
      />
    </div>
  </Teleport>
</template>

<script setup>
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const modalStore = useModalStore()

function onKeydown(event) {
  if (event.key === 'Escape' && modalStore.popup.isOpen) {
    modalStore.close()
  }
}

watch(
  () => modalStore.popup.isOpen,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)

  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
