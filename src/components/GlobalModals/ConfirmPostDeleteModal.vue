<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('feed.modal.delete.title')"
  >
    {{ $t('feed.modal.delete.body') }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.no') }}
      </BButton>
      <BButton
        variant="primary"
        @click="deletePost"
      >
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useRegisterModal } from '@/composables'
import { storeKey } from '@/store'
import { type deleteFeedItem } from '@/store/feed/actions/deleteFeedItem'
import type { StoreActionPayload } from '@/store/types'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_POST_DELETE

export default defineComponent({
  name: 'ConfirmPostDeleteModal',
  props: {
    feedItemId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()

    const shouldRedirectBack = () => {
      return ['FeedItemModal'].includes('' + route.name?.toString())
    }

    const hideDialog = () => {
      return isVisible.value = false
    }

    const deletePost = async () => {
      const payload: StoreActionPayload<typeof deleteFeedItem> = {
        id: props.feedItemId
      }
      await store.dispatch('feed/deleteFeedItem', payload)

      if (shouldRedirectBack()) {
        router.back()
      }
      hideDialog()
    }

    return {
      deletePost,
      hideDialog,
      isVisible,
      modalId,
      shouldRedirectBack,
    }
  }
})
</script>
