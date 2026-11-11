import {
  DeleteLikeOnCommentDocument,
  type IDeleteLikeOnCommentInput,
  type IDeleteLikeOnCommentMutation,
  type IDeleteLikeOnCommentMutationVariables,
  type IDeleteLikeOnCommentResponse,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type DeleteLikeOnCommentAction = FeedAction<IDeleteLikeOnCommentInput, IDeleteLikeOnCommentResponse>

export const deleteLikeOnComment: DeleteLikeOnCommentAction = async ({ commit }, { postId, commentId }) => {
  const input: IDeleteLikeOnCommentInput = {
    postId,
    commentId,
  }

  let response
  try {
    response = await mutateApollo<IDeleteLikeOnCommentMutation, IDeleteLikeOnCommentMutationVariables>({
      mutation: DeleteLikeOnCommentDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.DELETE_LIKE_ON_COMMENT)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.DELETE_LIKE_ON_COMMENT)
  }

  const { likeId } = data.deleteLikeOnComment

  commit('DELETE_FEED_ITEM_COMMENT_LIKE', {
    commentId,
    postId,
    likeId,
  })

  return {
    data: data.deleteLikeOnComment,
  }
}
