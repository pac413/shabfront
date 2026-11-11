import { type FeedMutation } from '@/store/feed/types'
import { type SubscribeToFeedType } from '@/types'

export const SET_ACTIVE_FEED_TYPE: FeedMutation<SubscribeToFeedType> = (state, type) => {
  state.activeFeedType = type
}
