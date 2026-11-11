<template>
  <div class="comments">
    <AddComment
      :media-sub-type="MediaSubType.COMMENT"
      :add-comment-id="addCommentId"
      :focus-on-input="focusOnInput"
      @submit="submitComment"
    />
    <div class="comment-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :feed-item="feedItem"
        :comment="comment"
        @submit-reply="submitReply"
        @like-comment="likeComment"
        @unlike-comment="unlikeComment"
        @edit-comment="editComment"
        @delete-comment="deleteComment"
        @flag-comment="flagComment"
      >
        <template #replies="{ comment, isReplyVisible }">
          <CommentReplies
            v-if="comment.replies || isReplyVisible"
            :feed-item="feedItem"
            :comment-id="comment.id"
            :replies="comment.replies"
            :replies-count="comment.repliesCount"
            :reply-enabled="isReplyVisible"
            @submit-reply="submitReply({ ...$event, comment })"
            @like-comment="likeComment({ comment: $event.comment, parent: comment })"
            @unlike-comment="unlikeComment({ comment: $event.comment, parent: comment })"
            @edit-comment="editComment({ ...$event, parent: comment })"
            @delete-comment="deleteComment({ comment: $event.comment, parent: comment })"
            @flag-comment="flagComment({ comment: $event.comment, parent: comment })"
          />
        </template>
      </CommentItem>
    </div>
    <Spinner v-if="showSpinner" />
    <BLink
      v-else-if="showMore"
      @click.prevent="loadMore"
    >
      {{ $t('feed.comments.view-more-comments') }}
    </BLink>
  </div>
</template>

<script lang="ts">
import { find } from 'linkifyjs'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import AddComment from '@/components/Feed/FeedItem/FeedItemComments/AddComment.vue'
import CommentItem from '@/components/Feed/FeedItem/FeedItemComments/CommentItem.vue'
import CommentReplies from '@/components/Feed/FeedItem/FeedItemComments/CommentReplies.vue'
import { useToast } from '@/composables'
import { IFlaggedContentType } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type createCommentOnFeedItem } from '@/store/feed/actions/createCommentOnFeedItem'
import { type createCommentReply } from '@/store/feed/actions/createCommentReply'
import { type createLikeOnComment } from '@/store/feed/actions/createLikeOnComment'
import { type createLikeOnCommentReply } from '@/store/feed/actions/createLikeOnCommentReply'
import { type deleteCommentOnFeedItem } from '@/store/feed/actions/deleteCommentOnFeedItem'
import { type deleteLikeOnComment } from '@/store/feed/actions/deleteLikeOnComment'
import { type deleteLikeOnCommentReply } from '@/store/feed/actions/deleteLikeOnCommentReply'
import { type deleteReplyOnComment } from '@/store/feed/actions/deleteReplyOnComment'
import { type loadFeedItemComments } from '@/store/feed/actions/loadFeedItemComments'
import { type updateCommentOnFeedItem } from '@/store/feed/actions/updateCommentOnFeedItem'
import { type updateReplyOnComment } from '@/store/feed/actions/updateReplyOnComment'
import type { FeedItemUploadMediaParams } from '@/store/feed/types'
import type { MediaUrlInfo } from '@/store/media/types'
import type { StoreActionPayload } from '@/store/types'
import { Modal, useModalStore } from '@/stores/modal'
import {
  type FeedItem,
  type IframelyResponse,
  MediaSubType,
  MediaType,
  type PostComment,
  type WebScrapedBasic
} from '@/types'
import { getMediaType } from '@/utils'

export default defineComponent({
  name: 'FeedItemCommentsList',
  components: {
    AddComment,
    CommentItem,
    CommentReplies,
  },
  props: {
    comments: {
      type: Array as () => PostComment[],
      required: true,
    },
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
    commentsCount: {
      type: Number,
      required: true,
    },
    focusOnInput: {
      type: Boolean,
      default: false,
    },
    fromModal: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const { showSuccessToast, showErrorToast } = useToast()
    const showSpinner = ref<boolean>(false)
    const showMore = computed(() => props.commentsCount > props.comments.length)
    const addCommentId = computed(() => props.fromModal ? `${props.feedItem.id}-modal` : props.feedItem.id)

    const loadMore = async () => {
      showSpinner.value = true
      const payload: StoreActionPayload<typeof loadFeedItemComments> = {
        postId: props.feedItem.id
      }
      const response = await store.dispatch('feed/loadFeedItemComments', payload)
      showSpinner.value = false

      if ('error' in response) {
        return showErrorToast(response)
      }
    }

    const uploadAttachment = async (params: {
      attachment: File
      mediaSubType: MediaSubType.COMMENT | MediaSubType.COMMENT_REPLY
      reference: { feedItemId: string; commentId: string; commentReplyId?: string },
      comment: PostComment
    }) => {
      const { attachment, mediaSubType, reference, comment } = params
      const uploadMediaParams: FeedItemUploadMediaParams = {
        file: attachment,
        mediaSubType,
        reference,
        onUrlGenerated: (params: MediaUrlInfo) => {
          const newComment = {
            ...comment,
            processingMediaId: params.id
          }
          store.commit('feed/PUSH_FEED_ITEM_COMMENT', {
            postId: props.feedItem.id,
            comment: newComment
          })
        }
      }
      const media = await store.dispatch('feed/uploadMedia', uploadMediaParams)

      // Trigger a toast that media upload is done
      const mediaType = getMediaType(attachment)
      const toastMessage =
        mediaType === MediaType.PICTURE
          ? t('post.upload-photo-success').toString()
          : t('post.upload-video-success').toString()
      showSuccessToast(toastMessage, t('profile-view.general.success').toString())
      return media
    }

    const submitComment = async (params: { content: string; attachment: File | null; mediaSubType: MediaSubType }) => {
      const { content, attachment } = params
      const payload: StoreActionPayload<typeof createCommentOnFeedItem> = {
        postId: props.feedItem.id,
        content,
        webScraped: await getWebScraped(content)
      }
      const response = await store.dispatch('feed/createCommentOnFeedItem', payload)
      if ('error' in response) {
        showErrorToast(response)
        return
      }

      const comment: PostComment = response.data
      if (attachment) {
        const media = await uploadAttachment({
          attachment: attachment!,
          mediaSubType: MediaSubType.COMMENT,
          reference: { feedItemId: props.feedItem.id, commentId: comment.id },
          comment
        })

        // Update the newly added comment by adding media
        const newComment = {
          ...comment,
          medias: [media]
        }
        store.commit('feed/PUSH_FEED_ITEM_COMMENT', {
          postId: props.feedItem.id,
          comment: newComment
        })
      }
    }

    const getWebScraped = async (comment: string): Promise<WebScrapedBasic | undefined> => {
      const links = find(comment)

      if (links.length) {
        const link = links[links.length - 1]
        const response = await store.dispatch('feed/getPreview', link.href)
        if ('error' in response) {
          showErrorToast(response)
          return
        }

        const preview: IframelyResponse = response.data
        if (preview && preview.meta) {
          const result: WebScrapedBasic = {
            canonical: preview.meta.canonical,
            site: preview.meta.site,
            url: link.value,
            title: preview.meta.title
          }

          if (preview.links && preview.links.thumbnail) {
            result.thumbnails = preview.links.thumbnail.map(item => ({
              height: item.media.height,
              width: item.media.width,
              href: item.href,
              type: item.type
            }))
          }

          return result
        }
      }
    }

    const submitReply = async (params: { comment: PostComment; content: string; attachment: File | null }) => {
      const { comment, content, attachment } = params
      const payload: StoreActionPayload<typeof createCommentReply> = {
        commentId: comment.id,
        postId: props.feedItem.id,
        content
      }
      const response = await store.dispatch('feed/createCommentReply', payload)

      if ('error' in response) {
        showErrorToast(response)
        return
      }

      const commentReply: PostComment = response.data
      if (attachment) {
        const media = await uploadAttachment({
          attachment: attachment!,
          mediaSubType: MediaSubType.COMMENT_REPLY,
          reference: { feedItemId: props.feedItem.id, commentId: comment.id, commentReplyId: commentReply.id },
          comment
        })

        // Update the newly added comment_reply by adding media
        commentReply.medias = [media]
        store.commit('feed/PUSH_FEED_ITEM_COMMENT_REPLY', {
          postId: props.feedItem.id,
          commentId: comment.id,
          comment
        })
      }
    }

    const likeComment = async (params: { comment: PostComment, parent: PostComment }) => {
      let response
      if (params.parent) {
        const payload: StoreActionPayload<typeof createLikeOnCommentReply> = {
          commentId: params.parent.id,
          commentReplyId: params.comment.id,
          postId: props.feedItem.id
        }
        response = await store.dispatch('feed/createLikeOnCommentReply', payload)
      } else {
        const payload: StoreActionPayload<typeof createLikeOnComment> = {
          commentId: params.comment.id,
          postId: props.feedItem.id
        }
        response = await store.dispatch('feed/createLikeOnComment', payload)
      }

      if ('error' in response) {
        showErrorToast(response)
        return
      }
    }

    const unlikeComment = async (params: { comment: PostComment, parent: PostComment }) => {
      let response
      if (params.parent) {
        const payload: StoreActionPayload<typeof deleteLikeOnCommentReply> = {
          commentId: params.parent.id,
          commentReplyId: params.comment.id,
          postId: props.feedItem.id
        }
        response = await store.dispatch('feed/deleteLikeOnCommentReply', payload)
      } else {
        const payload: StoreActionPayload<typeof deleteLikeOnComment> = {
          commentId: params.comment.id,
          postId: props.feedItem.id
        }
        response = await store.dispatch('feed/deleteLikeOnComment', payload)
      }

      if ('error' in response) {
        showErrorToast(response)
        return
      }
    }

    const editComment = async (params: { comment: PostComment, parent: PostComment, content: string }) => {
      const webScraped = await getWebScraped(params.content)
      let response
      if (params.parent) {
        const payload: StoreActionPayload<typeof updateReplyOnComment> = {
          commentId: params.parent.id,
          commentReplyId: params.comment.id,
          postId: props.feedItem.id,
          content: params.content,
          webScraped
        }
        response = await store.dispatch('feed/updateReplyOnComment', payload)
      } else {
        const payload: StoreActionPayload<typeof updateCommentOnFeedItem> = {
          commentId: params.comment.id,
          postId: props.feedItem.id,
          content: params.content,
          webScraped
        }
        response = await store.dispatch('feed/updateCommentOnFeedItem', payload)
      }

      if ('error' in response) {
        showErrorToast(response)
        return
      }
    }

    const deleteComment = async (params: { comment: PostComment, parent: PostComment }) => {
      let response
      if (params.parent) {
        const payload: StoreActionPayload<typeof deleteReplyOnComment> = {
          commentId: params.parent.id,
          commentReplyId: params.comment.id,
          postId: props.feedItem.id
        }
        response = await store.dispatch('feed/deleteReplyOnComment', payload)
      } else {
        const payload: StoreActionPayload<typeof deleteCommentOnFeedItem> = {
          commentId: params.comment.id,
          postId: props.feedItem.id
        }
        response = await store.dispatch('feed/deleteCommentOnFeedItem', payload)
      }

      if ('error' in response) {
        showErrorToast(response)
        return
      }
    }

    const flagComment =  (params: { comment: PostComment, parent: PostComment }) => {
      const { comment, parent } = params
      const resourceId = (() => {
        const ids = [props.feedItem.id]
        if (parent) { ids.push(parent.id) }
        ids.push(comment.id)
        return ids.join('__')
      })()
      showModal({
        modal: Modal.FLAG_CONTENT,
        props: {
          resourceId: resourceId,
          type: parent ? IFlaggedContentType.CommentReply : IFlaggedContentType.Comment
        }
      })
    }

    return {
      addCommentId,
      deleteComment,
      editComment,
      flagComment,
      getWebScraped,
      likeComment,
      loadMore,
      MediaSubType,
      showMore,
      showSpinner,
      submitComment,
      submitReply,
      unlikeComment,
      uploadAttachment,
    }
  }
})
</script>
