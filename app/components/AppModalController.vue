<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-controller"
      @click.self="modalStore.close()"
    >
      <component
        :is="activeModal"
        v-if="activeModal"
      />
    </div>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import ConsultationModal from '~/components/modals/ConsultationModal.vue'
import CallbackModal from '~/components/modals/CallbackModal.vue'
import FormResultModal from '~/components/modals/FormResultModal.vue'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const modalStore = useModalStore()
const { name, isOpen } = storeToRefs(modalStore)

const MODAL_COMPONENTS = {
  [MODAL_NAMES.consultation]: ConsultationModal,
  [MODAL_NAMES.callback]: CallbackModal,
  [MODAL_NAMES.formResult]: FormResultModal,
}

const activeModal = computed(() => MODAL_COMPONENTS[name.value] ?? null)

function onKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    modalStore.close()
  }
}

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

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
