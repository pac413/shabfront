<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="
      suspend ? $t('admin.recent-members.delete-suspend-modal.title') : $t('admin.recent-members.delete-modal.title')
    "
  >
    {{ suspend ? $t('admin.recent-members.delete-suspend-modal.body') : $t('admin.recent-members.delete-modal.body') }}
    <div class="modal-footer">
      <BButton variant="secondary" @click="hideDialog">
        {{ $t('general.no') }}
      </BButton>
      <BButton variant="primary" @click="removeMember">
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useRegisterModal, useToast } from '@/composables'
import { useDeleteMemberMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_MEMBER_DELETE

export default defineComponent({
  name: 'ConfirmMemberDeleteModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
    suspend: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()
    const { mutate, onError } = useDeleteMemberMutation({
      variables: {
        profileId: props.profileId,
        suspend: props.suspend,
      },
    })

    const hideDialog = () => {
      isVisible.value = false
    }

    const removeMember = async () => {
      await mutate()
      hideDialog()
    }

    onError((error) => showErrorToast(error))

    return {
      hideDialog,
      isVisible,
      modalId,
      removeMember,
    }
  },
})
</script>
