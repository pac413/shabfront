import { type FeedMutation } from '@/store/feed/types'

export const SET_CURRENT_FEED_ITEM_LOADING: FeedMutation<boolean> = (state, loading) => {
  state.currentFeedItemLoading = loading
}
