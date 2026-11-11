<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('feed.modal.hide-post-from-feed.title')"
  >
    {{ $t('feed.modal.hide-post-from-feed.body') }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.no') }}
      </BButton>
      <BButton
        variant="primary"
        @click="hidePostFromFeed"
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
import { type hidePostFromFeed as hidePostFromFeedAction } from '@/store/feed/actions/hidePostFromFeed'
import type { StoreActionPayload } from '@/store/types'
import { Modal } from '@/stores/modal'

const modalId = Modal.CONFIRM_POST_HIDE_FROM_FEED

export default defineComponent({
  name: 'ConfirmPostHideFromFeedModal',
  props: {
    feedItemId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const { isVisible } = useRegisterModal(modalId)

    const shouldRedirectBack = () => {
      return ['FeedItemModal'].includes('' + route.name?.toString())
    }

    const hideDialog = () => {
      isVisible.value = false
    }

    const hidePostFromFeed = async () => {
      const payload: StoreActionPayload<typeof hidePostFromFeedAction> = {
        id: props.feedItemId
      }
      await store.dispatch('feed/hidePostFromFeed', payload)

      if (shouldRedirectBack()) {
        router.back()
      }
      hideDialog()
    }

    return {
      hideDialog,
      hidePostFromFeed,
      isVisible,
      modalId,
      shouldRedirectBack,
    }
  }
})
</script>
