import { type FeedMutation } from '@/store/feed/types'
import { type LoadingStatus } from '@/store/types'

export const SET_FEED_LOADING: FeedMutation<LoadingStatus> = (state, loading) => {
  state.feedLoading = loading
}
