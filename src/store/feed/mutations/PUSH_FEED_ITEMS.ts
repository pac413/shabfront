import orderBy from 'lodash/orderBy'

import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

export const PUSH_FEED_ITEMS: FeedMutation<FeedItem[]> = (state, feedItems) => {
  const newIds = feedItems.map((f) => f.id)
  const feed = state.feed.filter((feedItem) => !newIds.includes(feedItem.id)).concat(feedItems)
  orderBy(feed, ['postedDate'], ['desc'])

  state.feed = feed
}
