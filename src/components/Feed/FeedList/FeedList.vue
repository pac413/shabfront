<template>
  <div class="feed-list">
    <div ref="editorCardRef">
      <BCard>
        <FeedItemEditor />
      </BCard>
    </div>
    <div class="feed-list__new-count">
      <BLink
        v-if="showNewFeedCount"
        class="feed-list__new-count-link"
        @click.prevent="reloadFeed"
      >
        <span>{{ $tc('feed.general.new-feed-count', newFeedCount, { count: newFeedCount }) }}</span>
      </BLink>
    </div>
    <SuggestionsCarousel />
    <div class="feed-list__pages">
      <FeedPreference v-if="!showLoadingSpinner || feed.length" />
      <FeedListItem
        v-for="item in feed"
        :key="item.id"
        :source="item"
        :show-trending="isTrending && !showLoadingSpinner"
      />
      <Spinner v-if="showLoadingSpinner" />
      <ScrollToTop position="right" />
    </div>

    <FeedItemPreviewModal
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
    <UploadPictureModal
      :upmid="FEED_ITEM_PREVIEW_UPM_ID"
      :title="$t('post.upload-photo')"
      :type="MediaSubType.POST"
      :editing-item="feedItemEditPictureItem"
      @submit="addPicture"
    />
    <UploadVideoModal
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

import ScrollToTop from '@/components/Common/ScrollToTop.vue'
import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import UploadVideoModal from '@/components/Common/UploadVideoModal.vue'
import FeedItemEditor from '@/components/Feed/FeedItemEditor/FeedItemEditor.vue'
import FeedItemPreviewModal from '@/components/Feed/FeedItemPreview/FeedItemPreviewModal.vue'
import FeedListItem from '@/components/Feed/FeedList/FeedListItem.vue'
import FeedPreference from '@/components/Feed/FeedPreference.vue'
import SuggestionsCarousel from '@/components/Suggestion/SuggestionsCarousel.vue'
import { useEditFeed, useToast } from '@/composables'
import type { IFeedContentSetting } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type loadFeedItemsByProfileId } from '@/store/feed/actions/loadFeedItemsByProfileId'
import { LoadingStatus, type StoreActionPayload } from '@/store/types'
import type {FeedItem, SimpleProfile} from '@/types'
import { MediaSubType, SubscribeToFeedType } from '@/types'
import { checkIfScrolledOverPercentage } from '@/utils'

export default defineComponent({
  name: 'FeedList',
  components: {
    FeedPreference,
    FeedListItem,
    ScrollToTop,
    FeedItemEditor,
    UploadVideoModal,
    UploadPictureModal,
    FeedItemPreviewModal,
    SuggestionsCarousel
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
    const feed = computed(() => store.state.feed.feed)
    const feedTotalCnt = computed(() => store.state.feed.feedTotal)
    const feedLoading = computed(() => store.state.feed.feedLoading)
    const newFeedCount = computed(() => store.state.feed.activeProfileNewFeedCount)
    const currentFeedSettings = computed<IFeedContentSetting | null>(() =>
      store.getters['profileSettings/currentFeedSettings']
    )
    const isTrending = computed<boolean>(() => store.getters['profileSettings/isTrending'])
    const editorCardRef = ref<HTMLDivElement | null>(null)
    const showNewFeedCount = computed(() => newFeedCount.value > 0)
    const showLoadingSpinner = computed(() => feedLoading.value === LoadingStatus.Loading)
    const isAllLoaded = computed(() =>
      feed.value!.length === feedTotalCnt.value && feedTotalCnt.value
    )
    const subscriptionToFeed = ref<ZenObservable.Subscription | null>(null)
    const subscriptionToFeedCount = ref<ZenObservable.Subscription | null>(null)
    const subscriptionToSimpleProfiles = ref<ZenObservable.Subscription | null>(null)

    const subscribeToFeed = async () => {
      unsubscribeToFeed()
      const feedItemIds = feed.value.map((feedItem: FeedItem) => feedItem.id)
      if (feedItemIds.length === 0) {
        subscriptionToFeed.value = null
      } else {
        const response = await store.dispatch('feed/subscribeToFeed', {
          feedItemIds,
          type: SubscribeToFeedType.GENERAL
        })
        if ('error' in response) {
          return showErrorToast(response)
        }
        subscriptionToFeed.value = response.data
      }
    }

    const unsubscribeToFeed = () => {
      if (subscriptionToFeed.value) {
        subscriptionToFeed.value.unsubscribe()
      }
    }

    const subscribeToNewFeedCount = async () => {
      unsubscribeToNewFeedCount()
      const response = await store.dispatch('feed/subscribeToNewFeedCount')
      if ('error' in response) {
        return showErrorToast(response)
      }
      subscriptionToFeedCount.value = response.data
    }

    const unsubscribeToNewFeedCount = () => {
      if (subscriptionToFeedCount.value) {
        subscriptionToFeedCount.value.unsubscribe()
      }
    }

    const subscribeToSimpleProfiles = async (profiles: SimpleProfile[]) => {
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

    const onScroll = async () => {
      if (checkIfScrolledOverPercentage()) {
        // load more feeds
        await loadMoreFeeds(false)
      }
    }

    const loadMoreFeeds = async (reset: boolean = false) => {
      // No need to load more if loading is in progress OR all is loaded already
      if (!reset && (feedLoading.value === LoadingStatus.Loading || isAllLoaded.value)) {
        return
      }
      const payload: StoreActionPayload<typeof loadFeedItemsByProfileId> = { reset }
      const response = await store.dispatch('feed/loadFeedItemsByProfileId', payload)
      if ('error' in response) {
        return showErrorToast(response)
      }

      const { profiles } = response.data
      if (reset) {
        subscribeToFeed()
        subscribeToNewFeedCount()
      }
      if (profiles && profiles.length > 0) {
        await subscribeToSimpleProfiles(profiles)
      }
    }

    const reloadFeed = async (shouldNotScroll?: boolean) => {
      await loadMoreFeeds(true)
      if (!shouldNotScroll) {
        editorCardRef.value?.scrollIntoView()
      }
    }

    onMounted(async () => {
      store.commit('feed/SET_ACTIVE_FEED_TYPE', SubscribeToFeedType.GENERAL)
      await loadMoreFeeds(true)
      store.commit('feed/RESET_FEED_LIST_ITEM_COMMENTS_HIDDEN')
      window.addEventListener('scroll', onScroll)
    })

    onBeforeUnmount(() => {
      unsubscribeToFeed()
      unsubscribeToNewFeedCount()
      unsubscribeToSimpleProfiles()
      store.commit('feed/RESET_FEED_LIST_ITEM_COMMENTS_HIDDEN')
      window.removeEventListener('scroll', onScroll)
    })

    watch(currentFeedSettings, () => {
      reloadFeed(true)
    })

    return {
      currentFeedSettings,
      editorCardRef,
      feed,
      feedLoading,
      feedTotalCnt,
      isAllLoaded,
      isTrending,
      loadMoreFeeds,
      MediaSubType,
      newFeedCount,
      onScroll,
      showLoadingSpinner,
      showNewFeedCount,
      reloadFeed,
      subscribeToFeed,
      subscribeToNewFeedCount,
      subscribeToSimpleProfiles,
      unsubscribeToNewFeedCount,
      unsubscribeToSimpleProfiles,

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
.feed-list__pages {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.feed-list__new-count {
  position: sticky;
  display: flex;
  justify-content: center;
  top: 74px;
  z-index: 1050;

  .feed-list__new-count-link {
    position: absolute;
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
}

.feed-list__page {
  width: 100%;
}
</style>
