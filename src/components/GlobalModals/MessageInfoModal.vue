<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    hide-header
    hide-footer
    body-class="message-info-container"
    dialog-class="message-info-modal"
  >
    <div>
      <p class="message-info-text pull-if-rtl-label">
        {{ `${$t(`messages.message-sent`)} - ${dateSent}` }}
      </p>
      <p class="message-info-text pull-if-rtl-label">
        {{ `${$t(`messages.message-read`)} - ${dateRead}` }}
      </p>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal } from '@/composables'
import { Modal } from '@/stores/modal'
import type { Message } from '@/types'
import { getMessageDate } from '@/utils'

const modalId = Modal.MESSAGE_INFO

export default defineComponent({
  name: 'MessageInfoModal',
  props: {
    data: {
      type: Object as () => Message,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const dateSent = computed(() => {
      if (props.data) {
        return getMessageDate(props.data.status.dateSent)
      } else {
        return ''
      }
    })

    const dateRead = computed(() => {
      if (props.data) {
        return getMessageDate(props.data.status.dateRead, `${t('messages.message-unread')}`)
      } else {
        return ''
      }
    })

    return {
      dateRead,
      dateSent,
      isVisible,
      modalId,
    }
  }
})
</script>

<style lang="scss">
.message-info-modal {
  width: fit-content;
}

.message-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .message-info-text {
    margin: 10px 0;
  }
}

</style>
