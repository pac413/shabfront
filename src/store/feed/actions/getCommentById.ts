import {
  CommentByIdDocument,
  type ICommentByIdQuery,
  type ICommentByIdQueryVariables,
  type IPostComment,
} from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type GetCommentByIdAction = FeedAction<ICommentByIdQueryVariables, IPostComment>

export const getCommentById: GetCommentByIdAction = async (_, { postId, commentId }) => {
  const variables: ICommentByIdQueryVariables = { postId, commentId }
  try {
    const { data } = await queryApollo<ICommentByIdQuery>({
      query: CommentByIdDocument,
      variables,
    })
    return { data: data.commentById }
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.GET_COMMENT_BY_ID)
  }
}
