<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="
      value
        ? $t('admin.recent-members.zealot-enable-modal.title')
        : $t('admin.recent-members.zealot-disable-modal.title')
    "
  >
    {{
      value ? $t('admin.recent-members.zealot-enable-modal.body') : $t('admin.recent-members.zealot-disable-modal.body')
    }}
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
import { useToggleZealotMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_ZEALOT

export default defineComponent({
  name: 'ConfirmZealotModal',
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
    const { mutate, onError } = useToggleZealotMutation({
      variables: {
        profileId: props.profileId,
        value: props.value,
      },
    })

    const hideDialog = () => (isVisible.value = false)
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
