import {
  type IPostCommentReply,
  type IUpdateReplyOnCommentInput,
  type IUpdateReplyOnCommentMutation,
  type IUpdateReplyOnCommentMutationVariables,
  UpdateReplyOnCommentDocument,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type UpdateReplyOnCommentAction = FeedAction<IUpdateReplyOnCommentInput, IPostCommentReply>

export const updateReplyOnComment: UpdateReplyOnCommentAction = async (
  { commit },
  { commentId, commentReplyId, content, postId, webScraped },
) => {
  const input: IUpdateReplyOnCommentInput = {
    commentId,
    commentReplyId,
    content,
    postId,
    webScraped,
  }

  let response
  try {
    response = await mutateApollo<IUpdateReplyOnCommentMutation, IUpdateReplyOnCommentMutationVariables>({
      mutation: UpdateReplyOnCommentDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_COMMENT_ON_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_COMMENT_ON_FEED_ITEM)
  }
  const commentReply = data.updateReplyOnComment

  commit('PUSH_FEED_ITEM_COMMENT_REPLY', { commentId, commentReply, postId })

  return { data: commentReply }
}
