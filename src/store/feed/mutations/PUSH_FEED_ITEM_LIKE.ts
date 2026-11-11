import orderBy from 'lodash/orderBy'

import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem, type PostLike } from '@/types'

type Payload = {
  like: PostLike
  postId: string
  total: number
}

/**
 * Pushes a new like into the FeedItem's latestLikes
 */
const pushFeedItemLike = (feedItem: FeedItem, like: PostLike) => {
  if (feedItem.likedByProfile) {
    return
  }
  const idx = feedItem.latestLikes.findIndex((r) => r.id === like.id)
  if (idx < 0) {
    feedItem.latestLikes = orderBy([...feedItem.latestLikes, like], ['date'], ['desc'])
  } else {
    feedItem.latestLikes.splice(idx, 1, like)
  }
}

export const PUSH_FEED_ITEM_LIKE: FeedMutation<Payload> = (state, payload) => {
  const { postId, like, total } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    pushFeedItemLike(currentFeedItem, like)
    currentFeedItem.likesCount = total
    currentFeedItem.likedByProfile = true
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  pushFeedItemLike(feedItem, like)
  feedItem.likesCount = total
  feedItem.likedByProfile = true
}
