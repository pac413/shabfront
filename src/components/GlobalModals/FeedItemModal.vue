<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    :visible="true"
    size="xl"
    hide-header
    hide-footer
    no-enforce-focus
    modal-class="feed-item-modal"
    @hidden="onHidden"
  >
    <div class="feed-item-modal__wrapper">
      <Spinner
        v-if="loading"
        class="flex-fill justify-content-center align-self-center"
      />
      <div
        v-else-if="!feedItem"
        class="load-error"
      >
        {{ $t('feed.modal.failed-to-load-post') }}
      </div>
      <div
        v-else
        class="feed-item-modal__content"
      >
        <div
          v-if="feedItem"
          class="feed-item-modal__main-content"
        >
          <div
            class="feed-item-modal__close-x"
            @click="handleClose"
          >
            <FaIcon :icon="['fas', 'times']" />
          </div>
          <div
            class="feed-item-modal__backdrop-close"
            @click="handleClose"
          />
          <template v-for="media in medias">
            <FeedItemVideo
              v-if="media.mediaType === MediaType.VIDEO"
              :key="`${media.id}-video`"
              class="video"
              :media="media"
              :feed-item-id="feedItem.id"
              :expanded="true"
              :current-time="currentTime"
              :for-modal="true"
            />
            <BImg
              v-else-if="media.mediaType === MediaType.PICTURE"
              :key="`${media.id}-picture`"
              lazy
              :src="getPublicMediaUrl(media.originalUrl)"
            />
          </template>
        </div>
        <div class="feed-item-modal__sidebar">
          <FeedItemDetail
            hide-media
            show-comments
            from-modal
            :item="feedItem"
          />
        </div>
      </div>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type ZenObservable from 'zen-observable'

import FeedItemDetail from '@/components/Feed/FeedItem/FeedItem.vue'
import FeedItemVideo from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemVideo.vue'
import { useRegisterModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import { type loadFeedItemById } from '@/store/feed/actions/loadFeedItemById'
import { type subscribeToFeedItem as subscribeToFeedItemAction } from '@/store/feed/actions/subscribeToFeedItem'
import type { StoreActionPayload, StoreActionResponse } from '@/store/types'
import { Modal, useModalStore } from '@/stores/modal'
import { MediaType } from '@/types'
import { getPublicMediaUrl } from '@/utils'

const modalId = Modal.FEED_ITEM

export default defineComponent({
  name: 'FeedItemModal',
  components: {
    FeedItemVideo,
    FeedItemDetail
  },
  props: {
    currentTime: {
      type: Number,
      default: 0,
    },
    modalFeedItemId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const { closeAllModals } = useModalStore()
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()
    const subscription = ref<ZenObservable.Subscription | null>(null)
    const authProfileId = computed(() => store.state.auth.profileId)
    const feedItem = computed(() => store.state.feed.currentFeedItem)
    const loading = computed(() => store.state.feed.currentFeedItemLoading)

    const profileId = computed(() => {
      return feedItem.value ? feedItem.value.postedBy : authProfileId.value
    })

    const medias = computed(() => {
      return feedItem.value ? feedItem.value.medias || [] : []
    })

    const subscribeToFeedItem = async () => {
      if (!props.modalFeedItemId) { return }

      const payload: StoreActionPayload<typeof subscribeToFeedItemAction> = props.modalFeedItemId
      const response: StoreActionResponse<typeof subscribeToFeedItemAction> =
        await store.dispatch('feed/subscribeToFeedItem', payload)
      if ('error' in response) {
        return showErrorToast(response)
      }
      subscription.value = response.data
    }

    const loadFeedItem = async () => {
      if (!props.modalFeedItemId) { return }
      const payload: StoreActionPayload<typeof loadFeedItemById> = props.modalFeedItemId
      const response: StoreActionResponse<typeof loadFeedItemById> =
        await store.dispatch('feed/loadFeedItemById', payload)
      if ('error' in response) {
        return showErrorToast(response)
      }
      subscribeToFeedItem()
    }

    const onHidden = () => {
      if (subscription.value) {
        subscription.value.unsubscribe()
      }
      closeAllModals()
    }

    const handleClose = () => {
      isVisible.value = false
    }

    watch(() => props.modalFeedItemId, () => loadFeedItem(), { immediate: true })

    return {
      authProfileId,
      feedItem,
      getPublicMediaUrl,
      handleClose,
      isVisible,
      loadFeedItem,
      loading,
      medias,
      MediaType,
      modalId,
      onHidden,
      profileId,
      subscribeToFeedItem,
      subscription,
    }
  }
})
</script>

<style lang="scss">
.feed-item-modal.show {
  background: rgba(0,0,0,0.6);
}

.feed-item-modal.show .modal-dialog {
  max-width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.feed-item-modal.show .modal-content {
  flex: 1;
  border: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
}

.feed-item-modal.show .modal-body {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.feed-item-modal__wrapper {
  display: flex;
  flex: 1;
}

.feed-item-modal__backdrop-close {
  position:fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: transparent;
  right: calc(max(20%, 350px));
}

.feed-item-modal__content {
  display:flex;
  flex: 1;
}

.feed-item-modal__main-content {
  flex: 1;
  justify-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;
  max-height: 100vh;

  img, .video {
    object-fit: contain;
    max-height: 100vh;
    max-width: 100%;
    width: 100%;
    z-index: 1;
  }
}

.feed-item-modal__sidebar {
  background-color: white;
  box-shadow: inset 0px 1px 15px rgba(0,0,0,0.2);
  flex: 0 0 20%;
  min-width: 350px;
  padding: 2rem 1.5rem;
  max-height: 100vh;
  overflow-y: auto;
}

.feed-item-modal__close-x {
  background: white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  z-index: 1040;
  padding: 10px;

  &:hover {
    box-shadow: 1px 1px 15px white;
    cursor: pointer;
  }
}

.load-error {
  background-color: white;
  border: solid 1px #CCC;
  border-radius:  5px;
  margin: 0 auto;
  padding: 7em;
  align-self: center;
}

.rtl-at-root {
  .feed-item-modal__backdrop-close {
    right: unset;
    left: calc(max(20%, 350px));
  }

  .feed-item-modal__main-content {
    img, .video {
      padding-left: unset;
    }
  }

  .feed-item-modal__close-x {
    left: unset;
    right: 1rem;
  }
}
</style>
