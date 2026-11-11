<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="$t('feed.modal.hide-all-posts-from.title')"
  >
    {{ $t('feed.modal.hide-all-posts-from.body', { name }) }}
    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.no') }}
      </BButton>
      <BButton
        variant="primary"
        @click="hideAllPostsFrom"
      >
        {{ $t('general.yes') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useRegisterModal } from '@/composables'
import { storeKey } from '@/store'
import { type hideAllPostsFrom as hideAllPostsFromAction } from '@/store/feed/actions/hideAllPostsFrom'
import type { StoreActionPayload } from '@/store/types'
import { Modal } from '@/stores/modal'
import type { SimpleProfile } from '@/types'

const modalId = Modal.CONFIRM_HIDE_ALL_POSTS_FROM

export default defineComponent({
  name: 'ConfirmHideAllPostsFromModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const { isVisible } = useRegisterModal(modalId)
    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )
    const name = computed(() => {
      const user = simpleProfileById.value(props.profileId)
      return user?.firstName
    })

    const shouldRedirectBack = () => {
      return ['FeedItemModal'].includes('' + route.name?.toString())
    }

    const hideDialog = () => {
      return isVisible.value = false
    }

    const hideAllPostsFrom = async () => {
      const payload: StoreActionPayload<typeof hideAllPostsFromAction> = {
        profileId: props.profileId
      }
      await store.dispatch('feed/hideAllPostsFrom', payload)

      if (shouldRedirectBack()) {
        router.back()
      }
      hideDialog()
    }
    
    return {
      hideAllPostsFrom,
      hideDialog,
      isVisible,
      modalId,
      name,
      shouldRedirectBack,
      simpleProfileById,
    }
  }
})
</script>
