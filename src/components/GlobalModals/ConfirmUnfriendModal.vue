<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('profile-view.friends.remove-friend-dialog-title', { fullName: profile.firstName })"
  >
    {{
      $t(
        'profile-view.friends.remove-friend-dialog-body',
        { firstName: profile.firstName + ' ' + profile.lastName }
      )
    }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideConfirmUnfriendDialog"
      >
        {{ $t('profile-view.friends.keep-as-friend') }}
      </BButton>
      <BButton
        variant="primary"
        @click="removeFriend"
      >
        {{ $t('profile-view.friends.remove-friend') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

import { useRegisterModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import { type removeFriend as removeFriendAction } from '@/store/connections/actions/friends/removeFriend'
import type { StoreActionPayload, StoreActionResponse } from '@/store/types'
import { Modal } from '@/stores/modal'
import type { SimpleProfile } from '@/types'

const modalId = Modal.CONFIRM_UNFRIEND

export default defineComponent({
  name: 'ConfirmUnfriendModal',
  props: {
    profile: {
      type: Object as () => SimpleProfile,
      required: true,
    },
    friendshipId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()
    const hideConfirmUnfriendDialog = () => {
      return isVisible.value = false
    }

    const removeFriend = async () => {
      const params: StoreActionPayload<typeof removeFriendAction> = {
        profileId: props.profile.id,
        requestId: props.friendshipId
      }
      const response: StoreActionResponse<typeof removeFriendAction> =
        await store.dispatch('connections/removeFriend', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }

      hideConfirmUnfriendDialog()
    }

    return {
      hideConfirmUnfriendDialog,
      isVisible,
      modalId,
      removeFriend,
    }
  }
})
</script>
