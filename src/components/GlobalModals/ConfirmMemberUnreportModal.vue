<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('admin.recent-members.unreport-modal.title')"
  >
    <div class="modal-footer">
      <BButton variant="secondary" @click="hideDialog">
        {{ $t('general.no') }}
      </BButton>
      <BButton variant="primary" @click="unreportMember">
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useRegisterModal, useToast } from '@/composables'
import { useUnreportMemberMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_MEMBER_UNREPORT

export default defineComponent({
  name: 'ConfirmMemberUnreportModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
    onComplete: {
      type: Function,
      required: true,
    }
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()
    const { mutate, onError } = useUnreportMemberMutation({
      variables: {
        profileId: props.profileId,
      },
      update(cache) {
        props.onComplete(cache)
      }
    })

    const hideDialog = () => {
      isVisible.value = false
    }

    const unreportMember = async () => {
      await mutate()
      hideDialog()
    }

    onError((error) => showErrorToast(error))

    return {
      hideDialog,
      isVisible,
      modalId,
      unreportMember,
    }
  },
})
</script>
