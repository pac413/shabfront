import {
  CreateReplyOnCommentDocument,
  type ICreateReplyOnCommentInput,
  type ICreateReplyOnCommentMutation,
  type ICreateReplyOnCommentMutationVariables,
  type IPostCommentReply,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type CreateCommentReplyAction = FeedAction<ICreateReplyOnCommentInput, IPostCommentReply>

export const createCommentReply: CreateCommentReplyAction = async (
  { commit },
  { postId, content, commentId, webScraped },
) => {
  const input: ICreateReplyOnCommentInput = {
    postId,
    content,
    commentId,
    webScraped,
  }

  let response
  try {
    response = await mutateApollo<ICreateReplyOnCommentMutation, ICreateReplyOnCommentMutationVariables>({
      mutation: CreateReplyOnCommentDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_REPLY_ON_COMMENT)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_REPLY_ON_COMMENT)
  }

  const commentReply = data.createReplyOnComment

  commit('PUSH_FEED_ITEM_COMMENT_REPLY', {
    commentId,
    commentReply,
    postId,
  })

  return { data: commentReply }
}
