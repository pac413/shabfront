import { type FeedMutation } from '@/store/feed/types'
import type { FeedItem, PostLike, SimpleProfile } from '@/types'

type Payload = {
  commentId: string
  postId: string
  like: PostLike
}

/**
 * Pushes a new comment like to comment
 */
const pushFeedItemCommentLike = (feedItem: FeedItem, commentId: string, like: PostLike) => {
  const comment = feedItem.latestComments.find((c) => c.id === commentId)
  if (!comment) {
    throw new Error('trying to add comment reply to non-reachable comment')
  }

  if (!comment.commentLikes) {
    comment.commentLikes = [like]
    return
  }

  const idx = comment.commentLikes.findIndex((r) => r.id === like.id)
  if (typeof like !== 'string') {
    like.likedBy = (like.likedBy as SimpleProfile).id
  }
  if (idx < 0) {
    comment.commentLikes.push(like)
  } else {
    comment.commentLikes.splice(idx, 1, like)
  }
}

export const PUSH_FEED_ITEM_COMMENT_LIKE: FeedMutation<Payload> = (state, payload) => {
  const { commentId, postId, like } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    pushFeedItemCommentLike(currentFeedItem, commentId, like)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  pushFeedItemCommentLike(feedItem, commentId, like)
}
