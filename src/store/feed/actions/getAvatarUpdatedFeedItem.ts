import { type ApolloQueryResult } from '@apollo/client/core'

import {
  AvatarUpdatedFeedItemDocument,
  type IAvatarUpdatedFeedItemQuery,
  type IAvatarUpdatedFeedItemQueryVariables,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type FeedItem } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = string
export type GetAvatarUpdatedFeedItemAction = FeedAction<Params, FeedItem | null>

export const getAvatarUpdatedFeedItem: GetAvatarUpdatedFeedItemAction = async ({ commit }, profileId) => {
  commit('SET_CURRENT_FEED_ITEM_LOADING', true)

  const variables: IAvatarUpdatedFeedItemQueryVariables = { profileId }
  let response: ApolloQueryResult<IAvatarUpdatedFeedItemQuery>

  try {
    response = await queryApollo<IAvatarUpdatedFeedItemQuery>({
      query: AvatarUpdatedFeedItemDocument,
      fetchPolicy: 'network-only',
      variables,
    })
  } catch (error: any) {
    commit('SET_CURRENT_FEED_ITEM_LOADING', false)
    return parseError(error, ERROR_BY_ACTION.GET_AVATAR_UPDATED_FEED_ITEM)
  }

  commit('SET_CURRENT_FEED_ITEM_LOADING', false)

  if (!response.data.avatarUpdatedFeedItem) {
    return { data: null }
  }

  // get profiles from feed
  const { feed, profiles } = getProfilesFromFeed(response.data.avatarUpdatedFeedItem as any)
  commit('profile/PUSH_PROFILES', profiles, { root: true })
  commit('SET_CURRENT_FEED_ITEM', feed)

  return { data: feed }
}
