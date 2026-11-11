<template>
  <div class="single-feed_wrapper">
    <Spinner v-if="loading" />
    <div
      v-else-if="!feedItem"
      class="text-center py-4"
    >
      {{ $t('errors.error-general') }}<br>
    </div>
    <div
      v-else
      class="pull-if-rtl inner-container p-3 py-sm-3 single-feed_content"
    >
      <feed-item-detail
        :item="feedItem"
        :hide-media="hideAllMedia"
        :show-menu="!isPublicFeedPage"
        show-comments
      />
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
import { useHead } from '@vueuse/head'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import type ZenObservable from 'zen-observable'

import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import UploadVideoModal from '@/components/Common/UploadVideoModal.vue'
import FeedItemDetail from '@/components/Feed/FeedItem/FeedItem.vue'
import FeedItemPreviewModal from '@/components/Feed/FeedItemPreview/FeedItemPreviewModal.vue'
import { useEditFeed, useToast } from '@/composables'
import { storeKey } from '@/store'
import { type loadFeedItemById } from '@/store/feed/actions/loadFeedItemById'
import type { StoreActionPayload } from '@/store/types'
import { MediaSubType, MediaType } from '@/types'
import { getPublicMediaUrl, getSingleIdFromRouteParam } from '@/utils'
import { DEFAULT_META_OPTIONS, DEFAULT_TITLE } from '@/utils/consts'

export default defineComponent({
  name: 'SingleFeed',
  components: {
    UploadVideoModal,
    UploadPictureModal,
    FeedItemPreviewModal,
    FeedItemDetail
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
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
    const activeProfileId = computed(() => store.state.auth.profileId)
    const feedItem = computed(() => store.state.feed.currentFeedItem)
    const hideAllMedia = computed(() => store.getters['profileSettings/hideAllMedia'])
    const loading = computed(() => store.state.feed.currentFeedItemLoading)
    const subscriptionToFeedItem = ref<ZenObservable.Subscription | null>(null)
    const feedId = computed(() => getSingleIdFromRouteParam(route.params.feedId))

    const metaUrl = computed(() => {
      return window.location.origin + route.fullPath
    })

    const isPublicFeedPage = computed(() => {
      return route.name === 'PublicFeedPage'
    })

    const feedItemMeta = computed(() => {
      let title = DEFAULT_TITLE
      let metaInfo = [
        ...DEFAULT_META_OPTIONS,
        { vmid: 'fb_url_meta', property: 'og:url', content: metaUrl.value },
        { vmid: 'fb_type_meta', property: 'og:type', content: 'article' },
      ]

      if (feedItem.value) {
        title = feedItem.value.content || DEFAULT_TITLE
        metaInfo.push(
          // og:title will be overwritten by child component (PostedBy)
          { vmid: 'fb_title_meta', property: 'og:title', content: feedItem.value.content },
          { vmid: 'fb_description_meta', property: 'og:description', content: feedItem.value.content.slice(0, 100) }
        )
        if (
          feedItem.value.webScraped
          && feedItem.value.webScraped.thumbnails
          && feedItem.value.webScraped.thumbnails[0]
        ) {
          // Use webscraped image if available
          metaInfo.push({
            vmid: 'fb_image_meta',
            property: 'og:image',
            content: getPublicMediaUrl(feedItem.value.webScraped.thumbnails[0].href) || ''
          })
        } else if (feedItem.value.medias && feedItem.value.medias.length) {
          switch (feedItem.value.medias[0].mediaType) {
          case MediaType.VIDEO: {
            const { thumbnails } = feedItem.value.medias[0]
            const thumbnailUrl = thumbnails && thumbnails.length ? thumbnails[0].url : ''
            metaInfo.push({
              vmid: 'fb_image_meta',
              property: 'og:image',
              content: getPublicMediaUrl(thumbnailUrl) || ''
            })
            break
          }
          case MediaType.PICTURE:
          default:
            metaInfo.push({
              vmid: 'fb_image_meta',
              property: 'og:image',
              content: getPublicMediaUrl(feedItem.value.medias[0].originalUrl) || ''
            })
            break
          }
        }
      }

      return {
        title,
        meta: metaInfo,
      }
    })

    const fetch = async () => {
      const feedId = getSingleIdFromRouteParam(route.params.feedId)
      if (!feedId) {
        return
      }
      const payload: StoreActionPayload<typeof loadFeedItemById> = feedId
      const response = await store.dispatch('feed/loadFeedItemById', payload)
      if ('error' in response) {
        return showErrorToast(response)
      }

      subscribe(feedId)
    }

    const subscribe = async (feedId: string) => {
      const response = await store.dispatch('feed/subscribeToFeedItem', feedId)
      if ('error' in response) {
        return showErrorToast(response)
      }
      subscriptionToFeedItem.value = response.data
    }

    watch(feedId, () => fetch(), { immediate: true })

    onBeforeUnmount(() => {
      store.commit('feed/SET_CURRENT_FEED_ITEM', null)
      subscriptionToFeedItem.value = null
    })

    useHead(feedItemMeta)

    return {
      activeProfileId,
      feedId,
      feedItem,
      fetch,
      hideAllMedia,
      isPublicFeedPage,
      loading,
      MediaSubType,
      metaUrl,
      subscribe,
      subscriptionToFeedItem,
      
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
.single-feed_wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.single-feed_content {
  display: flex;
  flex-direction: column;
  max-width: 780px;
}
</style>
