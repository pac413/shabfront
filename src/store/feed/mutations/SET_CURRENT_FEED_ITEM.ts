import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

export const SET_CURRENT_FEED_ITEM: FeedMutation<FeedItem | null> = (state, feedItem) => {
  state.currentFeedItem = feedItem
}
