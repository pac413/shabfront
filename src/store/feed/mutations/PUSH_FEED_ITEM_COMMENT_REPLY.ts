import orderBy from 'lodash/orderBy'

import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem, type PostComment } from '@/types'

type Payload = {
  commentId: string
  commentReply: PostComment
  postId: string
}

/**
 * Pushes a new comment reply to a feedItem
 */
const pushFeedItemCommentReply = (feedItem: FeedItem, commentId: string, reply: PostComment) => {
  const comment = feedItem.latestComments.find((c) => c.id === commentId)
  if (!comment) {
    throw new Error('trying to add comment reply to non-reachable comment')
  }
  if (!comment.replies) {
    comment.replies = [reply]
    return
  }

  const idx = comment.replies.findIndex((r) => r.id === reply.id)
  if (idx < 0) {
    comment.replies.push(reply)
  } else {
    comment.replies.splice(idx, 1, reply)
  }
  comment.replies = orderBy(comment.replies, ['date'], ['desc'])
}

export const PUSH_FEED_ITEM_COMMENT_REPLY: FeedMutation<Payload> = (state, payload) => {
  const { commentId, commentReply, postId } = payload
  const { currentFeedItem } = state

  // TODO: Investigate why but sometimes commentReply comes as null
  if (!commentReply) {
    return
  }

  if (currentFeedItem && currentFeedItem.id === postId) {
    pushFeedItemCommentReply(currentFeedItem, commentId, commentReply)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  pushFeedItemCommentReply(feedItem, commentId, commentReply)
}
