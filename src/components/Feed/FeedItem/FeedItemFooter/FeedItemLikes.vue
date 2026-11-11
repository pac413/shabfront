<template>
  <span
    v-if="activeProfile"
    class="feed-item-likes"
    :class="{ 'feed-item-likes--active': alreadyLiked }"
  >
    <a
      v-if="mode === 'comment'"
      :id="triggerId"
      class="link-style"
      :class="{ 'feed-item-likes__liked': alreadyLiked }"
      @click="onClick"
    >
      {{ $t('feed.comments.like') }}
    </a>

    <a
      v-else
      :id="triggerId"
      class="btn feed-item-likes__count"
      @click="onClick"
    >
      <FaIcon
        class="feed-item-likes__icon"
        :icon="['fal', 'thumbs-up']"
      />
      <span>{{ label }}</span>
    </a>
    <LikesPopover
      v-if="count"
      :count="count"
      :likes="likes"
      :trigger-id="triggerId"
      @view-all="viewAllLikes"
    />
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import LikesPopover from '@/components/Likes/LikesPopover.vue'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import type { FeedItem, PostLike } from '@/types'

export default defineComponent({
  name: 'FeedItemLikes',
  components: { LikesPopover },
  props: {
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
    count: {
      type: Number,
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
    likes: {
      type: Array as () => PostLike[],
      required: true,
    },
    alreadyLiked: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String as () => 'comment' | 'post',
      default: 'post'
    },
    fromModal: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['like', 'unlike'],
  setup(props, context) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const allLikes = ref<PostLike[] | null>(null)
    const label = computed(() => t('feed.likes.likes-count', { count: props.count }).toString())
    /**
     * Can't use this.$route.name here because transition to this modal is done in a tricky way
     * See the followings
     * src/components/Feed/FeedItem/FeedItemMedia/Video.vue :159
     * src/components/Feed/FeedItem/FeedItem.vue :162
     */
    const isInFeedItemModal = computed(() => window.location.pathname.includes('/feed/modal'))
    const triggerId = computed(() => `feed-item-${
      (props.fromModal || isInFeedItemModal.value) ?
        'modal-'
        : ''
    }likes-${props.mode === 'post' ? props.feedItem.id : props.commentId}`)

    const onClick = () => {
      if (props.alreadyLiked) {
        context.emit('unlike')
      } else {
        context.emit('like')
      }
    }

    const viewAllLikes = () => {
      showModal({
        modal: Modal.FEED_ITEM_LIKES,
        props: {
          feedItem: props.feedItem,
          commentId: props.commentId,
          parentId: props.parentId,
          isNested: props.isNested,
          mode: props.mode
        }
      })
    }
    return {
      activeProfile,
      allLikes,
      label,
      onClick,
      triggerId,
      viewAllLikes,
    }
  }
})
</script>

<style lang="scss" scoped>
.feed-item-likes--active {
  .feed-item-likes__icon, a.link-style {
    color: $colorRed;
  }
}

.feed-item-likes__count {
  font-size: 14px;

  &:active, &:focus, &:hover {
    border: none;
  }
}

.feed-item-likes__icon {
  margin-right: 5px;
}

.feed-item-likes__liked {
  &, &:hover {
    color: $colorRed
  }
}

.link-style {
  font-weight: bold;
}

.rtl-at-root {
  .feed-item-likes__icon {
    margin-left: 5px;
    margin-right: 0;
  }
}
</style>
