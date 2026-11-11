<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    :visible="true"
    size="xl"
    hide-header
    hide-footer
    no-enforce-focus
    modal-class="basic-photo-modal"
    @hidden="handleClose"
  >
    <div class="basic-photo-modal__wrapper">
      <div class="basic-photo-modal__content">
        <div class="close-x" @click="handleClose">
          <FaIcon :icon="['fas', 'times']" />
        </div>
        <div class="modal-backdrop-close" @click="handleClose" />
        <BImg lazy :src="photo" />
      </div>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useRegisterModal } from '@/composables'
import { Modal } from '@/stores/modal'
import { getPublicMediaUrl } from '@/utils'

const modalId = Modal.BASIC_PHOTO_MODAL

export default defineComponent({
  name: 'BasicPhotoModal',
  props: {
    originalMediaUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const photo = computed(() => getPublicMediaUrl(props.originalMediaUrl))

    const handleClose = () => {
      isVisible.value = false
    }

    return {
      handleClose,
      isVisible,
      modalId,
      photo,
    }
  },
})
</script>

<style lang="scss">
.basic-photo-modal.show {
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;

  .modal-dialog {
    max-width: 100%;
    height: 100%;
    margin: 0;
  }

  .modal-content {
    border: none;
    background-color: transparent;
    width: 100%;
    height: 100%;
  }

  .modal-body {
    padding: 0;
    height: 100%;
  }
}

.basic-photo-modal__wrapper {
  overflow: hidden;
  height: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-self: center;
}

.basic-photo-modal__content {
  display: flex;
  margin: auto;
  justify-self: center;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row-reverse;
  position: relative;

  > img {
    object-fit: contain;
    max-height: 90vh;
    max-width: 100%;
    padding-left: 1rem;
    z-index: 1;
  }
}

.modal-backdrop-close {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
}

.close-x {
  background: white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: -1rem;
  right: -1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  z-index: 1040;

  &:hover {
    box-shadow: 1px 1px 15px white;
    cursor: pointer;
  }
}

.rtl-at-root {
  .close-x {
    right: unset;
    left: -1rem;
  }
}
</style>
