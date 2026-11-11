import {
  DeleteReplyOnCommentDocument,
  type IDeleteReplyOnCommentInput,
  type IDeleteReplyOnCommentMutation,
  type IDeleteReplyOnCommentMutationVariables,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type DeleteReplyOnCommentAction = FeedAction<
  IDeleteReplyOnCommentInput,
  IDeleteReplyOnCommentMutation['deleteReplyOnComment']
>

export const deleteReplyOnComment: DeleteReplyOnCommentAction = async (
  { commit },
  { postId, commentId, commentReplyId },
) => {
  const input: IDeleteReplyOnCommentInput = {
    postId,
    commentId,
    commentReplyId,
  }

  let response
  try {
    response = await mutateApollo<IDeleteReplyOnCommentMutation, IDeleteReplyOnCommentMutationVariables>({
      mutation: DeleteReplyOnCommentDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.DELETE_REPLY_ON_COMMENT)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.DELETE_REPLY_ON_COMMENT)
  }

  commit('DELETE_FEED_ITEM_COMMENT_REPLY', {
    commentId,
    commentReplyId,
    postId,
  })

  return {
    data: {
      commentId,
      commentReplyId,
      postId,
    },
  }
}
