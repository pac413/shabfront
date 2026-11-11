import { LoadingStatus } from '@/store/types'
import { SubscribeToFeedType } from '@/types'

import { type FeedState } from './types'

export const getInitialState: () => FeedState = () => ({
  feed: [],
  feedLoading: LoadingStatus.Unloaded,
  feedTotal: 0,
  activeFeedType: SubscribeToFeedType.GENERAL,
  feedListCommentsHidden: {},
  currentFeedItem: null,
  currentFeedItemLoading: false,
  activeProfileNewFeedCount: 0,
  editableFeed: null,
  activeVideoId: null,
})

const state: FeedState = getInitialState()

export default state
