import {
  CreateLikeOnCommentReplyDocument,
  type ICreateLikeOnCommentReplyInput,
  type ICreateLikeOnCommentReplyMutation,
  type ICreateLikeOnCommentReplyMutationVariables,
  type IPostLike,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type CreateLikeOnCommentReplyAction = FeedAction<ICreateLikeOnCommentReplyInput, IPostLike>

export const createLikeOnCommentReply: CreateLikeOnCommentReplyAction = async (
  { commit },
  { postId, commentId, commentReplyId },
) => {
  const input: ICreateLikeOnCommentReplyInput = {
    postId,
    commentId,
    commentReplyId,
  }

  let response
  try {
    response = await mutateApollo<ICreateLikeOnCommentReplyMutation, ICreateLikeOnCommentReplyMutationVariables>({
      mutation: CreateLikeOnCommentReplyDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_LIKE_ON_COMMENT_REPLY)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_LIKE_ON_COMMENT_REPLY)
  }

  const { like } = data.createLikeOnCommentReply

  commit('PUSH_FEED_ITEM_COMMENT_REPLY_LIKE', {
    commentId,
    commentReplyId,
    postId,
    like,
  })

  return { data: like }
}
