<template>
  <div class="comment-item">
    <ProfileAvatar
      linkable
      class="comment-item__avatar me-2"
      size="3em"
      thumbnail="medium"
      :profile="commentedByProfile"
    />

    <div class="comment-item__main">
      <speech-bubble class="comment-item__speech-bubble w-100">
        <ProfileLinkableName
          class="comment-item__commented-by"
          :profile="commentedByProfile"
        />
        <ShowMoreText
          v-if="!isEditing"
          :text="contentWithLink"
          :lines="2"
          additional-container-css="padding: 0px;"
          additional-content-css="font-size: 14px;"
          additional-content-expanded-css="font-size: 14px;"
          additional-anchor-css="font-size: 14px; color: #f43838;"
        />
        <div
          v-else
          ref="commentRef"
          class="contenteditable comment-item__contenteditable"
          contenteditable
        />
        <template v-if="comment.processingMediaId && !hideAllMedia">
          <feed-item-media-skeleton
            :media-id="comment.processingMediaId"
            processing
            class="mt-2"
          />
        </template>
        <template v-if="!hideAllMedia">
          <feed-item-media
            v-for="media in comment.medias"
            :key="media.id"
            :media="media"
            class="w-100"
            @media-clicked="mediaClicked(media.originalUrl)"
          />
        </template>
        <div
          v-if="isEditing"
          class="comment-item_edit_buttons"
        >
          <BButton
            size="sm"
            variant="link"
            class="secondary-link"
            @click="isEditing = false"
          >
            {{ $t('general.cancel') }}
          </BButton>
          <BButton
            size="sm"
            variant="link"
            @click="updateComment"
          >
            {{ $t('feed.comments.save-changes') }}
          </BButton>
        </div>
      </speech-bubble>
      <OverlayMenu
        :id="`comment-item-menu_${comment.id}_${timestamp}`"
        ref="menuRef"
        class="comment-item__menu"
      >
        <template #icon>
          <FaIcon :icon="['fas', 'ellipsis-h']" />
        </template>
        <template #default="{ hide: hideMenu }">
          <OverlayMenuSection>
            <OverlayMenuItem
              v-if="isAdmin || isAuthor"
              :icon="['fal', 'pencil-alt']"
              icon-size="xs"
              :label="$t('feed.menu.edit-comment')"
              @hide-menu="hideMenu"
              @click="startEditingComment(comment)"
            />
            <OverlayMenuItem
              v-if="isAdmin || isAuthor"
              icon-size="xs"
              :icon="['fal', 'trash']"
              :label="$t('feed.menu.delete-comment')"
              @hide-menu="hideMenu"
              @click="deleteComment(comment)"
            />
            <OverlayMenuItem
              icon-size="xs"
              :icon="['far', 'flag']"
              :label="$t('feed.menu.flag')"
              @hide-menu="hideMenu"
              @click="flagComment(comment)"
            />
          </OverlayMenuSection>
        </template>
      </OverlayMenu>
    </div>

    <WebScrapedRendererBasic :web-scraped="comment.webScraped" />

    <div class="comment-item__actions">
      <feed-item-likes
        :feed-item="feedItem"
        :comment-id="comment.id"
        :parent-id="parentId"
        :is-nested="isNested"
        :already-liked="alreadyLiked"
        :count="comment.commentLikesCount"
        :likes="comment.commentLikes"
        mode="comment"
        @like="likeComment(comment)"
        @unlike="unlikeComment(comment)"
      />
      &middot;
      <a
        class="link-style"
        @click="showReply"
      >
        {{ $t('feed.comments.reply') }}
      </a>
      &middot;
      <span class="date">
        <AgoString
          abbreviate
          :date="comment.date"
        />
      </span>
    </div>
    <slot
      name="replies"
      :comment="comment"
      :is-reply-visible="addReplyVisible"
    />
  </div>
</template>

<script lang="ts">
import { type ComponentPublicInstance, computed, defineComponent, nextTick, ref } from 'vue'
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import OverlayMenu from '@/components/Common/OverlayMenu/OverlayMenu.vue'
import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import OverlayMenuSection from '@/components/Common/OverlayMenu/OverlayMenuSection.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import ShowMoreText from '@/components/Common/ShowMoreText/ShowMoreText.vue'
import SpeechBubble from '@/components/Common/SpeechBubble/SpeechBubble.vue'
import FeedItemLikes from '@/components/Feed/FeedItem/FeedItemFooter/FeedItemLikes.vue'
import FeedItemMedia from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemMedia.vue'
import FeedItemMediaSkeleton from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemMediaSkeleton.vue'
import WebScrapedRendererBasic from '@/components/WebScraped/WebScrapedRendererBasic.vue'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { type FeedItem, MediaType, type PostComment, type Profile, type SimpleProfile } from '@/types'
import { escapeHtml } from '@/utils'

export default defineComponent({
  name: 'CommentItem',
  components: {
    AgoString,
    FeedItemLikes,
    WebScrapedRendererBasic,
    ProfileLinkableName,
    SpeechBubble,
    ProfileAvatar,
    FeedItemMedia,
    OverlayMenu,
    OverlayMenuSection,
    OverlayMenuItem,
    FeedItemMediaSkeleton,
    ShowMoreText
  },
  props: {
    comment: {
      type: Object as () => PostComment,
      required: true,
    },
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
    isNested: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: String,
      default: null,
    },
  },
  emits: [
    'hide-menu',
    'show-reply',
    'like-comment',
    'unlike-comment',
    'flag-comment',
    'edit-comment',
    'delete-comment',
  ],
  setup(props, context) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const simpleProfileById = computed<(id: string) => Profile>(() => store.getters['profile/simpleProfileById'])
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const addReplyVisible = ref<boolean>(false)
    const isEditing = ref<boolean>(false)
    const editingPayload = ref<{ comment: PostComment | null, parent: PostComment | null } | null>(null)
    const menuRef = ref<ComponentPublicInstance<typeof OverlayMenu & { hide: () => void }> | null>(null)
    const commentRef = ref<HTMLDivElement | null>(null)
    const isAuthor = computed(() => {
      const commentedBy = props.comment.commentedBy as SimpleProfile
      if (commentedBy && commentedBy.id) {
        return commentedBy.id === activeProfileId.value
      }
      return props.comment.commentedBy === activeProfileId.value
    })
    const alreadyLiked = computed(() => {
      const { commentLikes } = props.comment
      if (!commentLikes) { return false }
      return !!commentLikes.find(cl => cl.likedBy === activeProfileId.value)
    })
    const commentedByProfile = computed(() => {
      const { commentedBy } = props.comment
      return typeof commentedBy === 'string'
        ? simpleProfileById.value(commentedBy)
        : commentedBy
    })
    const contentWithLink = computed(() => {
      const content = escapeHtml(props.comment.content)
      if (props.comment.webScraped && props.comment.webScraped.url && props.comment.content) {
        const link =
          `<a class="me-1" href="${props.comment.webScraped.canonical}" target="_blank">
            ${props.comment.webScraped.url}
          </a>`
        return props.comment.content.replace(props.comment.webScraped.url, link)
      }
      return content
    })
    const timestamp = computed(() => new Date().getMilliseconds())

    const showReply = () => {
      // If the reply already nested, do not enable 2nd level replies.
      // Instead trigger parent to show 1st level 'add reply' box
      if (props.isNested) {
        context.emit('show-reply')
      } else {
        addReplyVisible.value = true
      }
    }

    const likeComment = (comment: PostComment) => {
      context.emit('like-comment', { comment })
    }

    const unlikeComment = (comment: PostComment) => {
      context.emit('unlike-comment', { comment })
    }

    const flagComment = (comment: PostComment) => {
      context.emit('flag-comment', { comment })
    }

    const startEditingComment = (comment: PostComment) => {
      isEditing.value = true
      editingPayload.value = { comment, parent: null }

      nextTick(() => {
        if (!commentRef.value) {
          return
        }
        const contentEditor = commentRef.value
        contentEditor.innerHTML = comment.content
        contentEditor.focus()
        moveCursorToEnd()
      })
      menuRef.value?.hide()
    }

    const updateComment = () => {
      if (!commentRef.value) {
        return
      }
      const contentEditor = commentRef.value
      if (contentEditor.textContent && contentEditor.textContent.length) {
        context.emit('edit-comment', { ...editingPayload.value, content: contentEditor.textContent })
        // eslint-disable-next-line vue/no-mutating-props
        props.comment.content = contentEditor.textContent
        // reset
        contentEditor.innerHTML = ''
        isEditing.value = false
        editingPayload.value = null
      }
    }

    const deleteComment = (comment: PostComment) => {
      context.emit('delete-comment', { comment })
    }

    const moveCursorToEnd = () => {
      if (!commentRef.value) {
        return
      }
      const contentEditor = commentRef.value
      // ie11 10 9 ff safari
      var range = window.getSelection()! // Create range
      range.selectAllChildren(contentEditor) // range selects all child content under obj
      range.collapseToEnd() // Move the cursor to the end
    }

    const mediaClicked = (originalUrl: string) => {
      showModal({
        modal: Modal.BASIC_PHOTO_MODAL,
        props: {
          originalMediaUrl: originalUrl
        }
      })
    }

    return {
      activeProfileId,
      addReplyVisible,
      alreadyLiked,
      commentedByProfile,
      commentRef,
      contentWithLink,
      deleteComment,
      editingPayload,
      flagComment,
      hideAllMedia,
      isAdmin,
      isAuthor,
      isEditing,
      likeComment,
      mediaClicked,
      menuRef,
      MediaType,
      moveCursorToEnd,
      showReply,
      startEditingComment,
      timestamp,
      unlikeComment,
      updateComment,
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 4px;

  .comment-item__content {
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
}

.comment-item__avatar {
  margin-top: 0.5rem;
  flex: 0 0 auto;
}

.comment-item__main {
  position: relative;
  flex: 1;

  &:hover .comment-item__menu {
    opacity: 1;
    transition: opacity 300ms linear;
    height: 2rem;
    background-color: transparent;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: $colorLightGrey2;
    }
  }
}

.comment-item__speech-bubble {
  :deep(.bubble-body) {
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;

    a.profile-link {
      color: $colorText;
      font-size: 0.9em;
      font-weight: bold;
    }

    .comment-item__commented-by {
      color: $colorText;
      width: 100%;
    }
  }
}

.comment-item__contenteditable {
  outline: none;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font-size: .9rem;
  color: $colorText;
  min-height: 1rem;
  word-break: break-all;

  &::placeholder {
    color: $colorText;
  }

  &:focus, &:active {
    outline: none;
    box-shadow: none;

    &::placeholder {
      color: $colorGrey;
    }
  }
}

.comment-item_edit_buttons {
  margin-top: 1rem;

  .secondary-link {
    text-decoration: none;
  }

  :deep(.btn-link) {
    padding-left: 0;
  }
}

.comment-item__menu {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  width: 2rem;
  opacity: 0;
  align-self: center;
}

.comment-item__actions {
  flex-basis: 100%;
  margin-left: 4.1rem;
  font-size: 11px;

  :deep(a) {
    font-weight: bold;
    color: $colorText;
    padding: 0 2px;
    display: inline-flex;
  }

  .date {
    padding-left: 2px;
  }
}

:deep(.web-scraped-renderer-basic_preview) {
  margin: 2px 4rem 3px 50px;
}

.rtl-at-root {
  .comment-item__menu {
    right: auto;
    left: 0.5rem;
  }

  .comment-item__actions {
    margin-left: 0;
    margin-right: 4.1rem;

    .date {
      padding-left: 0;
      padding-right: 2px;
    }
  }

  :deep(.web-scraped-renderer-basic_preview) {
    margin: 3px 4rem 2px 50px;
  }
}
</style>
