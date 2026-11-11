import { type FeedMutation } from '@/store/feed/types'
import { type FeedItem } from '@/types'

export const PUT_INTO_POST_EDITOR: FeedMutation<FeedItem | null> = (state, feedItem) => {
  state.editableFeed = feedItem ? { ...feedItem } : null
}
