import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { subscribeToNewFeedCount as subscribe } from '@/graphql/subscriptions'
import { type FeedAction } from '@/store/feed/types'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type SubscribeToNewFeedCountAction = FeedAction<void, ZenObservable.Subscription>

export const subscribeToNewFeedCount: SubscribeToNewFeedCountAction = async ({ commit, state }) => {
  commit('SET_ACTIVE_PROFILE_NEW_FEED_COUNT', 0)

  const lastFeedItemDate = state.feed.length > 0 ? state.feed[0].postedDate : new Date().toISOString()

  let observer
  try {
    observer = await subscribe({ lastFeedItemDate })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.SUBSCRIBE_TO_NEW_FEED_COUNT)
  }

  const subscription = observer.subscribe({
    next(response: any) {
      const { count, total } = cloneDeep(response.data.subscribeToNewFeedCount)
      commit('SET_ACTIVE_PROFILE_NEW_FEED_COUNT', count as number)
      commit('SET_FEED_TOTAL', total as number)
    },
    error(err: any) {
      console.error(err)
    },
  })

  return { data: subscription }
}
