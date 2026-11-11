import { type ApolloQueryResult } from '@apollo/client/core'

import {
  type IProfileFeedItemsQuery,
  type IProfileFeedItemsQueryVariables,
  ProfileFeedItemsDocument,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { LoadingStatus } from '@/store/types'
import { type FeedItem, type SimpleProfile } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = {
  profileId?: string
  reset?: boolean
}

export type Response = {
  total: number
  feedItems: FeedItem[]
  profiles: SimpleProfile[]
}

export type LoadProfileFeedItemsAction = FeedAction<Params, Response>

const FEED_LIMIT = 10

export const loadProfileFeedItems: LoadProfileFeedItemsAction = async ({ commit, state }, params) => {
  const { profileId, reset } = params
  const offset = reset ? 0 : state.feed.length

  if (!reset && state.feedLoading !== LoadingStatus.Unloaded && state.feed.length >= state.feedTotal) {
    return {
      data: {
        total: state.feedTotal,
        feedItems: [],
        profiles: [],
      },
    }
  }

  commit('SET_FEED_LOADING', LoadingStatus.Loading)
  if (reset) {
    commit('SET_FEED_TOTAL', 0)
    commit('SET_FEED_ITEMS', [])
  }

  const variables: IProfileFeedItemsQueryVariables = {
    profileId,
    offset,
    limit: FEED_LIMIT,
  }
  let response: ApolloQueryResult<IProfileFeedItemsQuery>
  try {
    response = await queryApollo<IProfileFeedItemsQuery>({
      query: ProfileFeedItemsDocument,
      variables,
      fetchPolicy: reset ? 'network-only' : 'cache-first',
    })
  } catch (error: any) {
    commit('SET_FEED_LOADING', LoadingStatus.Loaded)
    return parseError(error, ERROR_BY_ACTION.LOAD_PROFILE_FEED_ITEMS)
  }

  commit('SET_FEED_LOADING', LoadingStatus.Loaded)

  // get profiles from feeds, update feeds
  const { feedItems, total } = response.data.profileFeedItems
  const profiles: SimpleProfile[] = []
  const polishedfeedItems = feedItems.map((feed: any) => {
    const { feed: updatedFeed, profiles: feedProfiles } = getProfilesFromFeed(feed)
    profiles.push(...feedProfiles)
    return updatedFeed
  })

  commit('SET_FEED_TOTAL', total)
  if (reset) {
    commit('profile/SET_PROFILES', profiles, { root: true })
    commit('SET_FEED_ITEMS', polishedfeedItems)
  } else {
    commit('profile/PUSH_PROFILES', profiles, { root: true })
    commit('PUSH_FEED_ITEMS', polishedfeedItems)
  }

  return {
    data: {
      total,
      feedItems: polishedfeedItems,
      profiles,
    },
  }
}
