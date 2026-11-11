<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('messages.delete-message-title')"
  >
    {{ $t('messages.delete-message-description') }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.no') }}
      </BButton>
      <BButton
        variant="primary"
        @click="deleteMessage"
      >
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { useRegisterModal } from '@/composables'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import type { Message } from '@/types'

const modalId = Modal.CONFIRM_MESSAGE_DELETE

export default defineComponent({
  name: 'ConfirmMessageDeleteModal',
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
    onSuccess: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const route = useRoute()
    const { isVisible } = useRegisterModal(modalId)

    const shouldRedirectBack = () => {
      return ['FeedItemModal'].includes('' + route.name?.toString())
    }

    const hideDialog = () => {
      return isVisible.value = false
    }

    const deleteMessage = async () => {
      await store.dispatch('message/deleteMessage', props.message)
      if (props.onSuccess) {
        props.onSuccess(props.message)
      }
      hideDialog()
    }

    return {
      deleteMessage,
      hideDialog,
      isVisible,
      modalId,
      shouldRedirectBack,
    }
  }
})
</script>
