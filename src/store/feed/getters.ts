import { type GetterTree } from 'vuex'

import { type RootState } from '@/store/types'

import { type FeedState } from './types'

const getters: GetterTree<FeedState, RootState> = {
  feed: (state) => state.feed,
  feedById: (state) => (feedId: string) => state.feed.find((item) => item.id === feedId),
}

export default getters
