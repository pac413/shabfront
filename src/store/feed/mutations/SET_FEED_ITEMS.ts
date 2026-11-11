import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

export const SET_FEED_ITEMS: FeedMutation<FeedItem[]> = (state, feedItems) => {
  state.feed = feedItems
}
