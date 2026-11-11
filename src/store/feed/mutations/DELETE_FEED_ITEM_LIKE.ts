import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

type Payload = {
  postId: string
  likeId: string
  total: number
}

const removeFeedItemLike = (feedItem: FeedItem, likeId: string) => {
  const idx = feedItem.latestLikes.findIndex((l) => l.id === likeId)
  if (idx < 0) {
    return
  }
  feedItem.latestLikes.splice(idx, 1)
}

export const DELETE_FEED_ITEM_LIKE: FeedMutation<Payload> = (state, payload) => {
  const { postId, likeId, total } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    removeFeedItemLike(currentFeedItem, likeId)
    currentFeedItem.likesCount = total
    currentFeedItem.likedByProfile = false
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  removeFeedItemLike(feedItem, likeId)
  feedItem.likesCount = total
  feedItem.likedByProfile = false
}
