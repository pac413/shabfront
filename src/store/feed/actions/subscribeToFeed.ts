import type ZenObservable from 'zen-observable'

import { subscribeToFeed as subscribe } from '@/graphql/subscriptions'
import { type FeedAction } from '@/store/feed/types'
import { type FeedItem, FeedSubscriptionEvents, PostType, type SubscribeToFeedType } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = {
  feedItemIds: string[]
  type: SubscribeToFeedType
}
export type SubscribeToFeedAction = FeedAction<Params, ZenObservable.Subscription | null>

export const subscribeToFeed: SubscribeToFeedAction = async ({ commit, rootState, state }, { feedItemIds, type }) => {
  let profileId = rootState.auth.profileId

  if (rootState.profile.currentProfile) {
    profileId = rootState.profile.currentProfile.id
  }

  if (!profileId) {
    return { data: null }
  }

  let observer
  try {
    observer = await subscribe({ profileId, feedItemIds, type })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.SUBSCRIBE_TO_FEED)
  }

  const subscription = observer.subscribe({
    next(response: any) {
      // If subscription for General feed happens when the user is in Profile feed page, we should reject it.
      // If subscription for Profile feed happens when the user is in General feed page, we should reject it.
      if (type !== state.activeFeedType) {
        return
      }

      const feedItem = response.data.subscribeToFeed.feedItem as FeedItem
      const event = response.data.subscribeToFeed.event
      const { feed: updatedFeed, profiles } = getProfilesFromFeed(feedItem)

      switch (event) {
      case FeedSubscriptionEvents.CREATED:
      case FeedSubscriptionEvents.UPDATED:
        commit('profile/PUSH_PROFILES', profiles, { root: true })
        commit('PUSH_FEED_ITEM', updatedFeed)
        break
      case FeedSubscriptionEvents.MEDIA_UPLOADED:
      case FeedSubscriptionEvents.MEDIA_PROCESSED:
        // Only add feedItem for this user, ignore other feed items cos they are for other users
        if (
          state.feed.find((feedItem) => feedItem.id === updatedFeed.id) ||
            updatedFeed.postType === PostType.AVATAR_UPDATED ||
            updatedFeed.postType === PostType.PICTURE_ADDED
        ) {
          commit('profile/PUSH_PROFILES', profiles, { root: true })
          commit('PUSH_FEED_ITEM', updatedFeed)
        }
        break
      case FeedSubscriptionEvents.DELETED:
        commit('DELETE_FEED_ITEM', updatedFeed.id)
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
