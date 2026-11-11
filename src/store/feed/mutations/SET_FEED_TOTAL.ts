import { type FeedMutation } from '@/store/feed/types'

export const SET_FEED_TOTAL: FeedMutation<number> = (state, total) => {
  state.feedTotal = total
}
