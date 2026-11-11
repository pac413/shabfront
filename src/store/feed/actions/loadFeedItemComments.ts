import { type ApolloQueryResult } from '@apollo/client/core'

import {
  FeedItemCommentsDocument,
  type IFeedItemCommentsInput,
  type IFeedItemCommentsQuery,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type PostComment } from '@/types'
import { getProfilesFromPostComments } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type LoadFeedItemCommentsAction = FeedAction<Pick<IFeedItemCommentsInput, 'postId'>, Array<PostComment>>

const FEED_ITEM_COMMENTS_LIMIT = 10

export const loadFeedItemComments: LoadFeedItemCommentsAction = async ({ commit, state }, { postId }) => {
  const feedItem = state.feed.find((f) => f.id === postId)
  const input: IFeedItemCommentsInput = {
    postId,
    limit: FEED_ITEM_COMMENTS_LIMIT,
    offset: feedItem ? feedItem.latestComments.length : 0,
  }

  let response: ApolloQueryResult<IFeedItemCommentsQuery>
  try {
    response = await queryApollo<IFeedItemCommentsQuery>({
      query: FeedItemCommentsDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.LOAD_FEED_ITEM_COMMENTS)
  }

  const { comments: originalComments, total } = response.data.feedItemComments
  const { comments, profiles } = getProfilesFromPostComments(originalComments as any)

  commit('PUSH_FEED_ITEM_COMMENTS', { comments, postId, total })
  commit('profile/PUSH_PROFILES', profiles, { root: true })

  return { data: comments }
}
