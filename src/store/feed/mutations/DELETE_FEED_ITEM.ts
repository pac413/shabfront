import { type FeedMutation } from '@/store/feed/types'

export const DELETE_FEED_ITEM: FeedMutation<string> = (state, postId) => {
  const idx = state.feed.findIndex((f) => f.id === postId)
  state.feed.splice(idx, 1)
}
