<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    scrollable
    :title="'All Likes (' + likesCount + ')'"
    ok-only
    @hidden="handleClose"
  >
    <div class="likes-modal__list">
      <like-list-item
        v-for="(like, index) in likes"
        :key="index"
        :profile="simpleProfileById(like.likedBy)"
        :date="like.date"
      />
    </div>
    <Spinner v-if="showSpinner" />
    <BLink
      v-else-if="showMore"
      @click.prevent="loadMore"
    >
      {{ $t('feed.likes.view-more') }}
    </BLink>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted,ref, watch } from 'vue'
import { useStore } from 'vuex'

import LikeListItem from '@/components/Likes/LikeListItem.vue'
import { useRegisterModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import { type loadCommentLikes } from '@/store/feed/actions/loadCommentLikes'
import { type loadFeedItemLikes } from '@/store/feed/actions/loadFeedItemLikes'
import type { StoreActionPayload } from '@/store/types'
import { Modal } from '@/stores/modal'
import type { FeedItem, PostLike, SimpleProfile } from '@/types'

const modalId = Modal.FEED_ITEM_LIKES

export default defineComponent({
  name: 'FeedItemLikesModal',
  components: {
    LikeListItem
  },
  props: {
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
    commentId: {
      type: String,
      default: null,
    },
    parentId: {
      type: String,
      default: null,
    },
    isNested: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as () => 'comment' | 'post',
      default: 'post',
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const { isVisible } = useRegisterModal(modalId)
    const { showErrorToast } = useToast()

    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )
    const likes = ref<PostLike[]>([])
    const showSpinner = ref<boolean>(false)

    const commentItem = computed(() => {
      if (props.feedItem) {
        const res = props.feedItem.latestComments.find(
          c => c.id === (props.isNested ? props.parentId : props.commentId)
        )
        if (props.isNested && res) {
          return (res.replies || []).find(r => r.id === props.commentId)
        }
        return res
      }
      return null
    })

    const likesCount = computed(() => {
      return props.mode === 'post'
        ? (props.feedItem ? props.feedItem.likesCount : 0)
        : (commentItem.value ? commentItem.value.commentLikesCount : 0)
    })

    const showMore = computed(() => {
      if (props.mode === 'post') {
        if (!props.feedItem) { return false }
        return props.feedItem.likesCount > likes.value.length
      } else {
        if (!commentItem.value) { return false }
        return commentItem.value.commentLikesCount > likes.value.length
      }
    })

    const loadMore = async () => {
      showSpinner.value = true
      const response = await (() => {
        if (props.mode === 'post') {
          const payload: StoreActionPayload<typeof loadFeedItemLikes> = {
            postId: props.feedItem.id,
            offset: likes.value.length
          }
          return store.dispatch('feed/loadFeedItemLikes', payload)
        } else {
          const payload: StoreActionPayload<typeof loadCommentLikes> = {
            postId: props.feedItem.id,
            commentId: props.commentId,
            offset: likes.value.length
          }
          return store.dispatch('feed/loadCommentLikes', payload)
        }
      })()
      showSpinner.value = false

      if ('error' in response) {
        return showErrorToast(response)
      }

      likes.value.push(...response.data)
    }

    onMounted(() => loadMore())

    const handleClose = () => {
      isVisible.value = false
    }

    const onCommentIdChange = () => {
      if (props.mode !== 'post') {
        if (!commentItem.value) {
          likes.value = []
          return
        }

        likes.value = commentItem.value.commentLikes || []
      }
    }

    watch(() => props.commentId, onCommentIdChange, { immediate: true })
    watch(() => props.parentId, onCommentIdChange, { immediate: true })

    return {
      commentItem,
      handleClose,
      isVisible,
      likes,
      likesCount,
      loadMore,
      modalId,
      showMore,
      showSpinner,
      simpleProfileById,
    }
  }
})
</script>

<style lang="scss" scoped>
.likes-modal__list {
  display: flex;
  flex-direction: column;
}
</style>
