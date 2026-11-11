import type { ApolloQueryResult } from '@apollo/client/core'

import {
  FeedItemByIdDocument,
  type IFeedItemByIdQuery,
  type IFeedItemByIdQueryVariables,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import type { FeedAction } from '@/store/feed/types'
import type { FeedItem } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = string
export type LoadFeedItemByIdAction = FeedAction<Params, FeedItem>

export const loadFeedItemById: LoadFeedItemByIdAction = async ({ commit }, postId) => {
  commit('SET_CURRENT_FEED_ITEM_LOADING', true)

  const variables: IFeedItemByIdQueryVariables = { id: postId }
  let response: ApolloQueryResult<IFeedItemByIdQuery>

  try {
    response = await queryApollo<IFeedItemByIdQuery>({
      query: FeedItemByIdDocument,
      variables,
    })
  } catch (error: any) {
    commit('SET_CURRENT_FEED_ITEM_LOADING', false)
    return parseError(error, ERROR_BY_ACTION.LOAD_FEED_ITEM_BY_ID)
  }

  // get profiles from feed
  const { feed, profiles } = getProfilesFromFeed(response.data.feedItemById as any)
  commit('profile/PUSH_PROFILES', profiles, { root: true })
  commit('SET_CURRENT_FEED_ITEM_LOADING', false)
  commit('SET_CURRENT_FEED_ITEM', feed)

  return { data: feed }
}
