import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem, type PostLike } from '@/types'

type Payload = {
  commentId: string
  commentReplyId: string
  postId: string
  like: PostLike
}

/**
 * Pushes a new like to comment reply
 */
const pushFeedItemCommentReplyLike = (
  feedItem: FeedItem,
  commentId: string,
  commentReplyId: string,
  like: PostLike,
) => {
  const comment = feedItem.latestComments.find((c) => c.id === commentId)
  if (!comment || !comment.replies) {
    throw new Error('trying to add comment like to non-reachable comment reply')
  }

  const commentReply = comment.replies.find((reply) => reply.id === commentReplyId)
  if (!commentReply) {
    throw new Error('trying to add comment like to non-reachable comment reply')
  }

  if (!commentReply.commentLikes) {
    commentReply.commentLikes = [like]
    return
  }

  const idx = commentReply.commentLikes.findIndex((r) => r.id === like.id)
  if (idx < 0) {
    commentReply.commentLikes.push(like)
  } else {
    commentReply.commentLikes.splice(idx, 1, like)
  }
}

export const PUSH_FEED_ITEM_COMMENT_REPLY_LIKE: FeedMutation<Payload> = (state, payload) => {
  const { commentId, commentReplyId, postId, like } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    pushFeedItemCommentReplyLike(currentFeedItem, commentId, commentReplyId, like)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  pushFeedItemCommentReplyLike(feedItem, commentId, commentReplyId, like)
}
