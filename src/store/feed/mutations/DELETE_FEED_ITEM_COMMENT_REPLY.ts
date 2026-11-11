import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

type Payload = {
  postId: string
  commentId: string
  commentReplyId: string
}

/**
 * Removes comment reply
 */
const removeFeedItemCommentReply = (feedItem: FeedItem, commentId: string, commentReplyId: string) => {
  const comment = feedItem.latestComments.find((c) => c.id === commentId)
  if (!comment) {
    throw new Error('trying to add comment reply to non-reachable comment')
  }

  if (!comment.replies) {
    return
  }

  const idx = comment.replies.findIndex((r) => r.id === commentReplyId)
  if (idx >= 0) {
    comment.replies.splice(idx, 1)
  }
}

export const DELETE_FEED_ITEM_COMMENT_REPLY: FeedMutation<Payload> = (state, payload) => {
  const { postId, commentId, commentReplyId } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    removeFeedItemCommentReply(currentFeedItem, commentId, commentReplyId)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  removeFeedItemCommentReply(feedItem, commentId, commentReplyId)
}
