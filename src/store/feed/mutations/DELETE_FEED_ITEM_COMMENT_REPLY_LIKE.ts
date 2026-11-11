import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

type Payload = {
  postId: string
  commentId: string
  commentReplyId: string
  likeId: string
}

/**
 * Removes like from a comment reply
 */
const removeFeedItemCommentReplyLike = (
  feedItem: FeedItem,
  commentId: string,
  commentReplyId: string,
  likeId: string,
) => {
  const comment = feedItem.latestComments.find((c) => c.id === commentId)
  if (!comment || !comment.replies) {
    throw new Error('trying to add comment reply to non-reachable comment')
  }

  const commentReply = comment.replies.find((reply) => reply.id === commentReplyId)
  if (!commentReply || !commentReply.commentLikes) {
    throw new Error('trying to add comment like to non-reachable comment reply')
  }

  const idx = commentReply.commentLikes.findIndex((r) => r.id === likeId)
  if (idx >= 0) {
    commentReply.commentLikes.splice(idx, 1)
  }
}

export const DELETE_FEED_ITEM_COMMENT_REPLY_LIKE: FeedMutation<Payload> = (state, payload) => {
  const { postId, commentId, commentReplyId, likeId } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    removeFeedItemCommentReplyLike(currentFeedItem, commentId, commentReplyId, likeId)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  removeFeedItemCommentReplyLike(feedItem, commentId, commentReplyId, likeId)
}
