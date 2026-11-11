import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { subscribeToFeed } from '@/graphql/subscriptions'
import { type FeedAction } from '@/store/feed/types'
import { type FeedItem, FeedSubscriptionEvents, SubscribeToFeedType } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type SubscribeToFeedItemAction = FeedAction<string, ZenObservable.Subscription | null>

export const subscribeToFeedItem: SubscribeToFeedItemAction = async ({ commit, rootState, state }, postId) => {
  let profileId = rootState.auth.profileId

  if (rootState.profile.currentProfile) {
    profileId = rootState.profile.currentProfile.id
  }

  if (!profileId) {
    return { data: null }
  }

  let observer
  try {
    observer = await subscribeToFeed({
      profileId,
      feedItemIds: [postId],
      type: SubscribeToFeedType.PROFILE,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.SUBSCRIBE_TO_FEED_ITEM)
  }

  const subscription = observer.subscribe({
    next(response: any) {
      const data = cloneDeep(response.data)
      const feedItem = data.subscribeToFeed.feedItem as FeedItem
      const event = data.subscribeToFeed.event
      const { feed: updatedFeed, profiles } = getProfilesFromFeed(feedItem)

      switch (event) {
      case FeedSubscriptionEvents.UPDATED:
        commit('profile/PUSH_PROFILES', profiles, { root: true })
        if (state.currentFeedItem?.id === updatedFeed.id) {
          commit('SET_CURRENT_FEED_ITEM', updatedFeed)
        }
        break
      case FeedSubscriptionEvents.MEDIA_UPLOADED:
      case FeedSubscriptionEvents.MEDIA_PROCESSED:
        // Only add feedItem for this user, ignore other feed items cos they are for other users
        if (state.feed.find((feedItem) => feedItem.id === updatedFeed.id)) {
          commit('profile/PUSH_PROFILES', profiles, { root: true })
        }
        if (state.currentFeedItem?.id === updatedFeed.id) {
          commit('SET_CURRENT_FEED_ITEM', updatedFeed)
        }
        break
      case FeedSubscriptionEvents.DELETED:
        if (state.currentFeedItem?.id === updatedFeed.id) {
          commit('SET_CURRENT_FEED_ITEM', null)
        }
        break
      default:
        break
      }
    },
    error(err: any) {
      console.error(err)
    },
  })

  return { data: subscription }
}
