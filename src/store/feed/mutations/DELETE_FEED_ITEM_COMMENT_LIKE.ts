import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

type Payload = {
  postId: string
  commentId: string
  likeId: string
}

/**
 * Removes like from a comment
 */
const removeFeedItemCommentLike = (feedItem: FeedItem, commentId: string, likeId: string) => {
  const comment = feedItem.latestComments.find((c) => c.id === commentId)
  if (!comment) {
    throw new Error('trying to add comment reply to non-reachable comment')
  }

  if (!comment.commentLikes) {
    return
  }

  const idx = comment.commentLikes.findIndex((r) => r.id === likeId)
  if (idx >= 0) {
    comment.commentLikes.splice(idx, 1)
  }
}

export const DELETE_FEED_ITEM_COMMENT_LIKE: FeedMutation<Payload> = (state, payload) => {
  const { postId, commentId, likeId } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    removeFeedItemCommentLike(currentFeedItem, commentId, likeId)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  removeFeedItemCommentLike(feedItem, commentId, likeId)
}
