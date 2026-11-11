<template>
  <div class="replies py-1">
    <div
      v-if="!expanded && firstReply && firstReplyCommentedByProfile"
      class="replies-teaser"
      @click="onExpand"
    >
      <ProfileAvatar
        size="2em"
        thumbnail="medium"
        :profile="firstReplyCommentedByProfile"
      />
      <span class="link-style">
        {{ $t('feed.comments.someone-replied', { name: firstReplyCommentedByProfile.displayName }) }}
        <span v-if="repliesCount > 1">&middot; {{ $t('feed.comments.replies', { number: repliesCount }) }}</span>
      </span>
    </div>
    <div
      v-else
      class="replies-comments"
    >
      <CommentItem
        v-for="comment in visibleReplies"
        :key="comment.id"
        :feed-item="feedItem"
        :comment="comment"
        :parent-id="commentId"
        :is-nested="true"
        @like-comment="$emit('like-comment', $event)"
        @unlike-comment="$emit('unlike-comment', $event)"
        @edit-comment="$emit('edit-comment', $event)"
        @delete-comment="$emit('delete-comment', $event)"
        @flag-comment="$emit('flag-comment', $event)"
        @show-reply="showNestedReply"
      />
      <BLink
        v-if="!isFullyExpanded && repliesCount > 3"
        class="ms-1"
        @click.prevent="viewAllClicked"
      >
        {{ $t('feed.comments.view-all-replies') }}
      </BLink>
      <AddComment
        v-if="replyEnabled || addNestedReply"
        :focus-on-input="true"
        :media-sub-type="MediaSubType.COMMENT_REPLY"
        :add-comment-id="commentId"
        @submit="submitReply"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import AddComment from '@/components/Feed/FeedItem/FeedItemComments/AddComment.vue'
import CommentItem from '@/components/Feed/FeedItem/FeedItemComments/CommentItem.vue'
import { storeKey } from '@/store'
import { type FeedItem, MediaSubType, type PostComment, type Profile } from '@/types'

export default defineComponent({
  name: 'CommentReplies',
  components: {
    AddComment,
    CommentItem,
    ProfileAvatar,
  },
  props: {
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
    },
    replies: {
      type: Array as () => PostComment[],
      default: () => [],
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    replyEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'like-comment',
    'unlike-comment',
    'edit-comment',
    'delete-comment',
    'flag-comment',
    'submit-reply',
  ],
  setup(props, context) {
    const store = useStore(storeKey)
    const simpleProfileById = computed<(id: string) => Profile>(() => store.getters['profile/simpleProfileById'])
    const isExpanded = ref<boolean>(false)
    const isFullyExpanded = ref<boolean>(false)
    const addNestedReply = ref<boolean>(false)
    const expanded = computed(() => props.replyEnabled || isExpanded.value)
    const sortedReplies = computed(() =>
      [...props.replies].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    )
    const firstReply = computed(() => sortedReplies.value[0] || null)
    const firstReplyCommentedByProfile = computed(() => {
      if (firstReply.value) {
        const { commentedBy } = firstReply.value
        return typeof commentedBy === 'string'
          ? simpleProfileById.value(commentedBy)
          : commentedBy
      }
      return null
    })
    const visibleReplies = computed(() => {
      return isFullyExpanded.value || props.repliesCount < 3
        ? sortedReplies.value
        : sortedReplies.value.slice(0, 3)
    })

    const showNestedReply = () => {
      addNestedReply.value = true
    }

    const onExpand = () => {
      isExpanded.value = true
    }

    const viewAllClicked = () => {
      isFullyExpanded.value = true
    }

    const submitReply = (params: { content: string; attachment: File | null }) => {
      context.emit('submit-reply', params)
    }

    return {
      addNestedReply,
      expanded,
      firstReply,
      firstReplyCommentedByProfile,
      isExpanded,
      isFullyExpanded,
      onExpand,
      MediaSubType,
      showNestedReply,
      simpleProfileById,
      submitReply,
      viewAllClicked,
      visibleReplies,
    }
  }
})
</script>

<style lang="scss" scoped>
.replies-teaser {
  font-weight: bold;
  font-size: .9em;
  color: $colorSecondary;
  padding-top: .25rem;
}

.replies {
  flex: 1;
  margin-left: 4.2rem;

  .link-style {
    display: inline-block;
    padding-left: 5px;
  }
}

.rtl-at-root {
  .replies {
    margin-left: 0;
    margin-right: 4.2rem;

    .link-style {
      padding-left: 0;
      padding-right: 5px;
    }
  }
}
</style>
