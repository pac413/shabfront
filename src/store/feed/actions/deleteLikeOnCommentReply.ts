import {
  DeleteLikeOnCommentReplyDocument,
  type IDeleteLikeOnCommentReplyInput,
  type IDeleteLikeOnCommentReplyMutation,
  type IDeleteLikeOnCommentReplyMutationVariables,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type DeleteLikeOnCommentReplyAction = FeedAction<
  IDeleteLikeOnCommentReplyInput,
  IDeleteLikeOnCommentReplyMutation['deleteLikeOnCommentReply']
>

export const deleteLikeOnCommentReply: DeleteLikeOnCommentReplyAction = async (
  { commit },
  { postId, commentId, commentReplyId },
) => {
  const input: IDeleteLikeOnCommentReplyInput = {
    postId,
    commentId,
    commentReplyId,
  }

  let response
  try {
    response = await await mutateApollo<IDeleteLikeOnCommentReplyMutation, IDeleteLikeOnCommentReplyMutationVariables>({
      mutation: DeleteLikeOnCommentReplyDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.DELETE_LIKE_ON_COMMENT_REPLY)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.DELETE_LIKE_ON_COMMENT_REPLY)
  }

  const { likeId } = data.deleteLikeOnCommentReply

  commit('DELETE_FEED_ITEM_COMMENT_REPLY_LIKE', {
    commentId,
    commentReplyId,
    postId,
    likeId,
  })

  return {
    data: data.deleteLikeOnCommentReply,
  }
}
