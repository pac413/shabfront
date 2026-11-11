import { type FeedMutation } from '@/store/feed/types'

export const SET_ACTIVE_PROFILE_NEW_FEED_COUNT: FeedMutation<number> = (state, count) => {
  state.activeProfileNewFeedCount = count
}
