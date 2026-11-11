import {
  CreateLikeOnCommentDocument,
  type ICreateLikeOnCommentInput,
  type ICreateLikeOnCommentMutation,
  type ICreateLikeOnCommentMutationVariables,
  type IPostLike,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type CreateLikeOnCommentAction = FeedAction<ICreateLikeOnCommentInput, IPostLike>

export const createLikeOnComment: CreateLikeOnCommentAction = async ({ commit }, { postId, commentId }) => {
  const input: ICreateLikeOnCommentInput = {
    postId,
    commentId,
  }

  let response
  try {
    response = await mutateApollo<ICreateLikeOnCommentMutation, ICreateLikeOnCommentMutationVariables>({
      mutation: CreateLikeOnCommentDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_LIKE_ON_COMMENT)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_LIKE_ON_COMMENT)
  }

  const { like } = data.createLikeOnComment

  commit('PUSH_FEED_ITEM_COMMENT_LIKE', {
    commentId,
    postId,
    like,
  })

  return { data: like }
}
