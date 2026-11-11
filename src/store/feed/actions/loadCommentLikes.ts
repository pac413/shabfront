import { cloneDeep } from 'lodash'

import { CommentLikesDocument, type ICommentLikesInput, type ICommentLikesQuery } from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type PostLike } from '@/types'
import { getProfilesFromPostLikes } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type LoadCommentLikesAction = FeedAction<Omit<ICommentLikesInput, 'limit'>, Array<PostLike>>

const FEED_ITEM_COMMENTS_LIMIT = 10

export const loadCommentLikes: LoadCommentLikesAction = async ({ commit }, { postId, commentId, offset }) => {
  const input: ICommentLikesInput = {
    postId,
    commentId,
    limit: FEED_ITEM_COMMENTS_LIMIT,
    offset,
  }
  let response
  try {
    response = await queryApollo<ICommentLikesQuery>({
      query: CommentLikesDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.LOAD_FEED_ITEM_LIKES)
  }
  const originalLikes = cloneDeep(response.data.commentLikes.likes as any[]) as PostLike[]
  const { likes, profiles } = getProfilesFromPostLikes(originalLikes)

  commit('profile/PUSH_PROFILES', profiles, { root: true })

  return { data: likes }
}
