import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

type Payload = {
  postId: string
  commentId: string
  total: number
}

const removeCommentOnFeedItem = (feedItem: FeedItem, commentId: string) => {
  const idx = feedItem.latestComments.findIndex((l) => l.id === commentId)
  if (idx < 0) {
    return
  }
  feedItem.latestComments.splice(idx, 1)
}

export const DELETE_COMMENT_ON_FEED_ITEM: FeedMutation<Payload> = (state, payload) => {
  const { postId, commentId, total } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    removeCommentOnFeedItem(currentFeedItem, commentId)
    currentFeedItem.commentsCount = total
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  removeCommentOnFeedItem(feedItem, commentId)
  feedItem.commentsCount = total
}
