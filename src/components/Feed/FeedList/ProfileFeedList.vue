<template>
  <div class="profile-feed-list">
    <BCard v-if="viewingSelf">
      <feed-item-editor />
    </BCard>
    <div class="profile-feed-list__pages">
      <feed-list-item
        v-for="item in feed"
        :key="item.id"
        :source="item"
      />
      <Spinner v-if="showLoadingSpinner" />
    </div>

    <feed-item-preview-modal
      :id="FEED_ITEM_PREVIEW_MODAL_ID"
      :title="editableFeed ? $t('post.edit-preview') : $t('post.create-preview')"
      :attachment="feedItemAttachment"
      :loading="feedItemSubmitLoading"
      @add-picture="openUploadPictureModal"
      @add-video="openUploadVideoModal"
      @add-job="openJobModal"
      @submit="createOrUpdateFeedItem"
      @hidden="resetFeedItem"
      @clear-attachment="clearFeedItemAttachment"
      @edit-picture="editFeedItemAttachment"
    />
    <upload-picture-modal
      :upmid="FEED_ITEM_PREVIEW_UPM_ID"
      :title="$t('post.upload-photo')"
      :type="MediaSubType.POST"
      :editing-item="feedItemEditPictureItem"
      @submit="addPicture"
    />
    <upload-video-modal
      :id="FEED_ITEM_PREVIEW_UVM_ID"
      :title="$t('post.upload-video')"
      @submit="addVideo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type ZenObservable from 'zen-observable'

import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import UploadVideoModal from '@/components/Common/UploadVideoModal.vue'
import FeedItemEditor from '@/components/Feed/FeedItemEditor/FeedItemEditor.vue'
import FeedItemPreviewModal from '@/components/Feed/FeedItemPreview/FeedItemPreviewModal.vue'
import FeedListItem from '@/components/Feed/FeedList/FeedListItem.vue'
import { useEditFeed, useToast } from '@/composables'
import { storeKey } from '@/store'
import { type loadProfileFeedItems } from '@/store/feed/actions/loadProfileFeedItems'
import { LoadingStatus, type StoreActionPayload } from '@/store/types'
import { MediaSubType, type Profile, SubscribeToFeedType } from '@/types'
import { checkIfScrolledOverPercentage } from '@/utils'

export default defineComponent({
  name: 'ProfileFeedList',
  components: {
    FeedListItem,
    FeedItemEditor,
    UploadPictureModal,
    UploadVideoModal,
    FeedItemPreviewModal,
  },
  setup() {
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const {
      addPicture,
      addVideo,
      clearFeedItemAttachment,
      createOrUpdateFeedItem,
      editableFeed,
      editFeedItemAttachment,
      FEED_ITEM_PREVIEW_MODAL_ID,
      FEED_ITEM_PREVIEW_UPM_ID,
      FEED_ITEM_PREVIEW_UVM_ID,
      feedItemAttachment,
      feedItemEditPictureItem,
      feedItemSubmitLoading,
      openJobModal,
      openUploadPictureModal,
      openUploadVideoModal,
      resetFeedItem,
    } = useEditFeed()
    const profile = computed(() => store.state.profile.currentProfile)
    const feed = computed(() => store.state.feed.feed)
    const feedLoading = computed(() => store.state.feed.feedLoading)
    const feedTotalCnt = computed(() => store.state.feed.feedTotal)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const profileId = computed(() => profile.value?.id)
    const showLoadingSpinner = computed(() =>
      feedLoading.value === LoadingStatus.Loading
    )
    const isAllLoaded = computed(() =>
      feed.value!.length === feedTotalCnt.value && feedTotalCnt.value
    )
    const subscriptionToSimpleProfiles = ref<ZenObservable.Subscription | null>(null)
    const subscriptionToFeed = ref<ZenObservable.Subscription | null>(null)

    const subscribeToSimpleProfiles = async (profiles: Profile[]) => {
      unsubscribeToSimpleProfiles()
      const profileIds: string[] = profiles.map((profile) => profile.id)
      subscriptionToSimpleProfiles.value = await store.dispatch('profile/subscribeToSimpleProfiles', {
        profileIds,
        reset: false
      })
    }

    const unsubscribeToSimpleProfiles = () => {
      if (subscriptionToSimpleProfiles.value) {
        subscriptionToSimpleProfiles.value.unsubscribe()
      }
    }

    const subscribeToFeed = async () => {
      unsubscribeToFeed()
      const feedItemIds = feed.value.map((feedItem) => feedItem.id)
      const response = await store.dispatch('feed/subscribeToFeed', {
        feedItemIds,
        type: SubscribeToFeedType.PROFILE
      })
      if ('error' in response) {
        return showErrorToast(response)
      }
      subscriptionToFeed.value = response.data
    }

    const unsubscribeToFeed = () => {
      if (subscriptionToFeed.value) {
        subscriptionToFeed.value.unsubscribe()
      }
    }

    const onScroll = async () => {
      if (checkIfScrolledOverPercentage()) {
        // load more feeds
        await loadMoreProfileFeeds(false)
      }
    }

    const loadMoreProfileFeeds = async (reset: boolean = false) => {
      // No need to load more if loading is in progress OR all is loaded already
      if (!reset && (feedLoading.value === LoadingStatus.Loading || isAllLoaded.value)) {
        return
      }
      const payload: StoreActionPayload<typeof loadProfileFeedItems> = {
        profileId: profileId.value,
        reset
      }
      const response = await store.dispatch(
        'feed/loadProfileFeedItems',
        payload
      )
      if ('error' in response) {
        return showErrorToast(response)
      }

      const { profiles } = response.data
      if (reset) {
        subscribeToFeed()
      }
      if (profiles && profiles.length > 0) {
        await subscribeToSimpleProfiles(profiles)
      }
    }

    watch(profileId, () => loadMoreProfileFeeds(true), { immediate: true })

    onMounted(() => {
      store.commit('feed/SET_ACTIVE_FEED_TYPE', SubscribeToFeedType.PROFILE)
      store.commit('feed/RESET_FEED_LIST_ITEM_COMMENTS_HIDDEN')
      window.addEventListener('scroll', onScroll)
    })

    onBeforeUnmount(() => {
      unsubscribeToFeed()
      unsubscribeToSimpleProfiles()
      store.commit('feed/RESET_FEED_LIST_ITEM_COMMENTS_HIDDEN')
      window.removeEventListener('scroll', onScroll)
    })

    return {
      feed,
      feedLoading,
      feedTotalCnt,
      isAllLoaded,
      loadMoreProfileFeeds,
      MediaSubType,
      onScroll,
      profile,
      profileId,
      showLoadingSpinner,
      subscribeToFeed,
      subscribeToSimpleProfiles,
      unsubscribeToSimpleProfiles,
      unsubscribeToFeed,
      viewingSelf,

      addPicture,
      addVideo,
      clearFeedItemAttachment,
      createOrUpdateFeedItem,
      editableFeed,
      editFeedItemAttachment,
      FEED_ITEM_PREVIEW_MODAL_ID,
      FEED_ITEM_PREVIEW_UPM_ID,
      FEED_ITEM_PREVIEW_UVM_ID,
      feedItemAttachment,
      feedItemEditPictureItem,
      feedItemSubmitLoading,
      openJobModal,
      openUploadPictureModal,
      openUploadVideoModal,
      resetFeedItem,
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-feed-list__pages {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.profile-feed-list__new-count {
  position: sticky;
  top: 10px;
  margin-top: 10px;
  padding: 10px 15px;
  background: transparentize($colorRed, 0.1);
  z-index: 1050;

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.35);
  border-radius: 20px;
  color: #fff;
  display: inline-flex;
  text-decoration: none;
  align-items: center;

  &:hover {
    text-decoration: none;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  }
}

.profile-feed-list__page {
  width: 100%;

  :deep(.card) {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e4e4e4;
    border-radius: 12px;
    margin-bottom: 0.5rem;
    padding: 18px 20px;
  }
}
</style>
