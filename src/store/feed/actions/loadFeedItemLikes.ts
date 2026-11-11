import { type ApolloQueryResult } from '@apollo/client/core'

import { FeedItemLikesDocument, type IFeedItemLikesInput, type IFeedItemLikesQuery } from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type PostLike } from '@/types'
import { getProfilesFromPostLikes } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type LoadFeedItemLikesAction = FeedAction<Pick<IFeedItemLikesInput, 'postId' | 'offset'>, Array<PostLike>>

const FEED_ITEM_COMMENTS_LIMIT = 10

export const loadFeedItemLikes: LoadFeedItemLikesAction = async ({ commit }, { postId, offset }) => {
  const input: IFeedItemLikesInput = {
    postId,
    limit: FEED_ITEM_COMMENTS_LIMIT,
    offset,
  }
  let response: ApolloQueryResult<IFeedItemLikesQuery>
  try {
    response = await queryApollo<IFeedItemLikesQuery>({
      query: FeedItemLikesDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.LOAD_FEED_ITEM_LIKES)
  }
  const { likes: originalLikes } = response.data.feedItemLikes
  const { likes, profiles } = getProfilesFromPostLikes(originalLikes as any)

  commit('profile/PUSH_PROFILES', profiles, { root: true })

  return { data: likes }
}
