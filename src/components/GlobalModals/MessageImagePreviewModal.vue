<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    centered
    hide-footer
    size="xl"
  >
    <BImg
      v-if="image"
      class="image-preview-modal__img"
      lazy
      :src="image"
    />
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useRegisterModal } from '@/composables'
import { Modal } from '@/stores/modal'

const modalId = Modal.MESSAGE_IMAGE_PREVIEW_MODAL

export default defineComponent({
  name: 'MessageImagePreviewModal',
  props: {
    image: {
      type: String as () => string | ArrayBuffer | null,
      default: null,
    }
  },
  setup() {
    const { isVisible } = useRegisterModal(modalId)

    return {
      isVisible,
      modalId,
    }
  }
})
</script>

<style lang="scss" scoped>
.image-preview-modal__img {
  width: 100%;
  height: 100%;
  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 20px);
  object-fit: contain;

  @include media-breakpoint-up(md) {
    max-width: calc(100vw - 100px);
    max-height: calc(100vh - 100px);
  }
}

</style>
