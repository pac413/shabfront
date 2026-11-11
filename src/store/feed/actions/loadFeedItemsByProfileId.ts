import { type ApolloQueryResult } from '@apollo/client/core'

import {
  FeedItemsByProfileIdDocument,
  type IFeedItemsByProfileIdQuery,
  type IFeedItemsByProfileIdQueryVariables,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { LoadingStatus } from '@/store/types'
import { type FeedItem, type SimpleProfile } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = { reset?: boolean } | undefined
export type Response = {
  total: number
  feedItems: FeedItem[]
  profiles: SimpleProfile[]
}

export type LoadFeedItemsByProfileIdAction = FeedAction<Params, Response>

const FEED_LIMIT = 10

export const loadFeedItemsByProfileId: LoadFeedItemsByProfileIdAction = async (
  { commit, state, rootState },
  params,
) => {
  const reset = params?.reset
  if (state.feedLoading !== LoadingStatus.Unloaded && !reset && state.feed.length >= state.feedTotal) {
    return {
      data: {
        total: state.feedTotal,
        feedItems: [],
        profiles: [],
      },
    }
  }

  const { activeProfile } = rootState.profile
  const profileId = activeProfile!.id

  const offset = reset ? 0 : state.feed.length

  commit('SET_FEED_LOADING', LoadingStatus.Loading)

  const variables: IFeedItemsByProfileIdQueryVariables = {
    profileId,
    offset,
    limit: FEED_LIMIT,
  }
  let response: ApolloQueryResult<IFeedItemsByProfileIdQuery>

  try {
    response = await queryApollo<IFeedItemsByProfileIdQuery>({
      query: FeedItemsByProfileIdDocument,
      fetchPolicy: reset ? 'network-only' : 'cache-first',
      variables,
    })
  } catch (error: any) {
    commit('SET_FEED_LOADING', LoadingStatus.Loaded)
    return parseError(error, ERROR_BY_ACTION.LOAD_FEED_ITEMS_BY_PROFILE_ID)
  }

  commit('SET_FEED_LOADING', LoadingStatus.Loaded)

  // get profiles from feeds, update feeds
  const { feedItems, total } = response.data.feedItemsByProfileId
  const profiles: SimpleProfile[] = []
  const updatedFeedItems = feedItems.map((feed: any) => {
    const { feed: updatedFeed, profiles: feedProfiles } = getProfilesFromFeed(feed)
    profiles.push(...feedProfiles)
    return updatedFeed
  })

  commit('SET_FEED_TOTAL', total)
  if (reset) {
    commit('profile/SET_PROFILES', profiles, { root: true })
    commit('SET_FEED_ITEMS', updatedFeedItems)
  } else {
    commit('profile/PUSH_PROFILES', profiles, { root: true })
    commit('PUSH_FEED_ITEMS', updatedFeedItems)
  }
  return {
    data: {
      total,
      feedItems: updatedFeedItems,
      profiles,
    },
  }
}
