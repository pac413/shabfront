<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('admin.flagged-contents.delete-content-modal.title')"
  >
    {{ $t('admin.flagged-contents.delete-content-modal.body') }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.no') }}
      </BButton>
      <BButton
        variant="primary"
        @click="deleteContent"
      >
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useRegisterModal } from '@/composables'
import type { IFlaggedContentFragmentFragment } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_CONTENT_DELETE

export default defineComponent({
  name: 'ConfirmContentDeleteModal',
  props: {
    content: {
      type: Object as () => IFlaggedContentFragmentFragment,
      required: true,
    },
    onDeleteConfirmed: {
      type: Function,
      required: true,
    }
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const hideDialog = () => {
      return isVisible.value = false
    }

    const deleteContent = () => {
      props.onDeleteConfirmed()
      hideDialog()
    }

    return {
      deleteContent,
      hideDialog,
      isVisible,
      modalId,
    }
  }
})
</script>
