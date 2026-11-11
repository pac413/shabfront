<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="
      value ? $t('admin.recent-members.admin-grant-modal.title') : $t('admin.recent-members.admin-revoke-modal.title')
    "
  >
    {{ value ? $t('admin.recent-members.admin-grant-modal.body') : $t('admin.recent-members.admin-revoke-modal.body') }}
    <div class="modal-footer">
      <BButton variant="secondary" @click="hideDialog">
        {{ $t('general.no') }}
      </BButton>
      <BButton variant="primary" :disabled="loading" @click="action">
        <BSpinner
          v-if="loading"
          variant="primary"
          small
          class="mr-2"
        />
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useRegisterModal, useToast } from '@/composables'
import { useToggleAdminMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_ADMIN

export default defineComponent({
  name: 'ConfirmAdminModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()
    const { loading, mutate, onError } = useToggleAdminMutation({
      variables: {
        profileId: props.profileId,
        value: props.value,
      },
    })
    const hideDialog = () => {
      isVisible.value = false
    }
    const action = async () => {
      await mutate()
      hideDialog()
    }

    onError((error) => showErrorToast(error))

    return {
      action,
      hideDialog,
      loading,
      isVisible,
      modalId,
    }
  },
})
</script>
