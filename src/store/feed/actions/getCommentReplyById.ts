import {
  CommentReplyByIdDocument,
  type ICommentReplyByIdInput,
  type ICommentReplyByIdQuery,
  type IPostCommentReply,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type GetCommentByIdAction = FeedAction<ICommentReplyByIdInput, IPostCommentReply | null>

export const getCommentReplyById: GetCommentByIdAction = async (_, { postId, commentId, commentReplyId }) => {
  const input: ICommentReplyByIdInput = {
    postId,
    commentId,
    commentReplyId,
  }
  try {
    const { data } = await queryApollo<ICommentReplyByIdQuery>({
      query: CommentReplyByIdDocument,
      variables: { input },
    })
    return { data: data.commentReplyById }
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.GET_COMMENT_REPLY_BY_ID)
  }
}
