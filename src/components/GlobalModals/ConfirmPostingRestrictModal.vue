<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('feed.modal.posting-restrict.title')"
  >
    {{ $t('feed.modal.posting-restrict.body', { name }) }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.no') }}
      </BButton>
      <BButton
        variant="primary"
        @click="restrictPosting"
      >
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { useRegisterModal, useToast } from '@/composables'
import { useSetRestrictionsMutation } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import type { SimpleProfile } from '@/types'

const modalId = Modal.CONFIRM_POSTING_RESTRICT

export default defineComponent({
  name: 'ConfirmPostingRestrictModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const { mutate } = useSetRestrictionsMutation()
    const { showSuccessToast, showErrorToast } = useToast()
    const { isVisible } = useRegisterModal(modalId)
    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )
    const name = computed(() => {
      const user = simpleProfileById.value(props.profileId)
      return user?.firstName
    })

    const hideDialog = () => {
      return isVisible.value = false
    }

    const restrictPosting = async () => {
      try {
        await mutate({
          input: {
            profileId: props.profileId,
            feed: true,
          },
        })

        showSuccessToast(
          'To view the corrected feed please refresh the feed page',
          `${name.value} is restricted from posting`
        )
      } catch (error: any) {
        showErrorToast(error, `Unable to restrict ${name.value} from posting`)
      }

      hideDialog()
    }

    return {
      hideDialog,
      isVisible,
      modalId,
      name,
      restrictPosting,
    }
  }
})
</script>
