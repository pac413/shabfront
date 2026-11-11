<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('admin.recent-members.restore-modal.title')"
  >
    {{ $t('admin.recent-members.restore-modal.body') }}
    <div class="modal-footer">
      <BButton variant="secondary" @click="hideDialog">
        {{ $t('general.no') }}
      </BButton>
      <BButton variant="primary" @click="restoreMember">
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useRegisterModal, useToast } from '@/composables'
import { useUnsuspendAccountMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_MEMBER_RESTORE

export default defineComponent({
  name: 'ConfirmMemberRestoreModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()
    const { mutate, onError } = useUnsuspendAccountMutation({
      variables: {
        profileId: props.profileId,
      },
    })

    const hideDialog = () => {
      isVisible.value = false
    }

    const restoreMember = async () => {
      await mutate()
      hideDialog()
    }

    onError((error) => showErrorToast(error))

    return {
      hideDialog,
      isVisible,
      modalId,
      restoreMember,
    }
  },
})
</script>
