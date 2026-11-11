<template>
  <div class="feed-item__wrapper">
    <div class="feed-item__header">
      <PostedBy
        class="feed-item__posted-by"
        :posted-by="item.postedBy"
        :updated-at="item.postedDate"
        :last-activity-at="item.lastActivityAt"
        :show-trending="showTrending"
      />
      <FeedItemMenu
        v-if="showMenu"
        :feed-item="item"
        :posted-by="item.postedBy"
      />
    </div>
    <FeedItemContent
      v-if="!shouldHideFeedContent"
      :feed-item="item"
    />
    <template v-if="!hideMedia">
      <template v-if="item.processingMediaId || item.attachmentMediaId">
        <FeedItemMediaSkeleton
          v-if="item.processingMediaId"
          :media-id="item.processingMediaId"
          processing
          class="mt-2"
        />
        <FeedItemMediaSkeleton
          v-if="item.attachmentMediaId"
          :media-id="item.attachmentMediaId"
          class="mt-2"
        />
      </template>
      <FeedItemMedia
        v-for="media in item.medias"
        v-else
        :key="media.id"
        :media="media"
        :feed-item-id="item.id"
      />
    </template>
    <div class="feed-item__footer">
      <FeedItemLikes
        :feed-item="item"
        :already-liked="item.likedByProfile"
        :count="item.likesCount"
        :likes="item.latestLikes"
        :from-modal="fromModal"
        @like="addLike"
        @unlike="removeLike"
      />
      <div class="feed-item__actions">
        <FeedItemShare :feed-item="item" />
      </div>
      <div class="feed-item__meta">
        <FeedItemViews
          v-if="postViewEnabled"
          :count="item.viewsCount"
        />
        <FeedItemCommentCount
          :count="item.commentsCount"
          @click="$emit('toggle-comments')"
        />
      </div>
    </div>
    <transition-group name="slide-up">
      <template v-if="showComments">
        <hr :key="`hr-${item.id}`">
        <FeedItemCommentsList
          :key="`comments-${item.id}`"
          :feed-item="item"
          :focus-on-input="focusOnCommentInput"
          :comments="item.latestComments"
          :comments-count="item.commentsCount"
          :from-modal="fromModal"
        />
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import FeedItemCommentsList from '@/components/Feed/FeedItem/FeedItemComments/FeedItemCommentsList.vue'
import FeedItemContent from '@/components/Feed/FeedItem/FeedItemContent.vue'
import FeedItemCommentCount from '@/components/Feed/FeedItem/FeedItemFooter/FeedItemCommentCount.vue'
import FeedItemLikes from '@/components/Feed/FeedItem/FeedItemFooter/FeedItemLikes.vue'
import FeedItemShare from '@/components/Feed/FeedItem/FeedItemFooter/FeedItemShare.vue'
import FeedItemViews from '@/components/Feed/FeedItem/FeedItemFooter/FeedItemViews.vue'
import FeedItemMedia from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemMedia.vue'
import FeedItemMediaSkeleton from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemMediaSkeleton.vue'
import FeedItemMenu from '@/components/Feed/FeedItem/FeedItemMenu.vue'
import PostedBy from '@/components/Feed/FeedItem/PostedBy.vue'
import { useFeatureEnabled,useToast } from '@/composables'
import { storeKey } from '@/store'
import { type createLikeOnFeedItem } from '@/store/feed/actions/createLikeOnFeedItem'
import { type deleteLikeOnFeedItem } from '@/store/feed/actions/deleteLikeOnFeedItem'
import type { StoreActionPayload } from '@/store/types'
import { type FeedItem, PostType } from '@/types'

export default defineComponent({
  name: 'FeedItemDetail',
  components: {
    FeedItemCommentCount,
    FeedItemCommentsList,
    FeedItemContent,
    PostedBy,
    FeedItemLikes,
    FeedItemViews,
    FeedItemMedia,
    FeedItemMenu,
    FeedItemShare,
    FeedItemMediaSkeleton,
  },
  props: {
    item: {
      type: Object as () => FeedItem,
      required: true,
    },
    showComments: {
      type: Boolean,
      default: true,
    },
    hideMedia: {
      type: Boolean,
      default: false,
    },
    showMenu: {
      type: Boolean,
      default: true,
    },
    showTrending: {
      type: Boolean,
      default: false,
    },
    fromModal: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['toggle-comments'],
  setup(props) {
    const { isFeatureEnabled } = useFeatureEnabled()
    const route = useRoute()
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const focusOnCommentInput = ref<boolean>(false)

    const postViewEnabled = computed(() => isFeatureEnabled('postViewEnabled'))

    const shouldHideFeedContent = computed(() => {
      // Hide feed context when it's
      // - system generated for avatar or profile picture 
      // - belonging to general feed (not profile feed)
      const systemGeneratedPostTypesForAvatarAndPicture = [
        PostType.AVATAR_UPDATED,
        PostType.PICTURE_ADDED
      ]
      const isGeneralFeed = route.name === 'FeedPage'
      return isGeneralFeed && systemGeneratedPostTypesForAvatarAndPicture.includes(props.item.postType)
    })

    const addLike = async () => {
      const payload: StoreActionPayload<typeof createLikeOnFeedItem> = {
        postId: props.item.id
      }
      const response = await store.dispatch('feed/createLikeOnFeedItem', payload)
      if ('error' in response) {
        showErrorToast(response)
      }
    }

    const removeLike = async () => {
      const payload: StoreActionPayload<typeof deleteLikeOnFeedItem> = {
        postId: props.item.id
      }
      const response = await store.dispatch('feed/deleteLikeOnFeedItem', payload)
      if ('error' in response) {
        showErrorToast(response)
      }
    }

    watch(() => props.showComments, () => {
      if (props.showComments) {
        focusOnCommentInput.value = true
      }
    })

    return {
      addLike,
      focusOnCommentInput,
      postViewEnabled,
      shouldHideFeedContent,
      removeLike,
    }
  }
})
</script>

<style lang="scss" scoped>
.feed-item__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.feed-item__posted-by {
  flex: 1;
}

.feed-item__footer {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.feed-item__actions {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}

.feed-item__meta {
  & > * {
    margin-left: 10px;
  }
}

.rtl-at-root {
  .feed-item__meta {
    & > * {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}
</style>
