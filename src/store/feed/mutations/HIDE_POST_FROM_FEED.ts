import { type FeedMutation } from '@/store/feed/types'

export const HIDE_POST_FROM_FEED: FeedMutation<string> = (state, postId) => {
  const idx = state.feed.findIndex((f) => f.id === postId)
  state.feed.splice(idx, 1)
}
