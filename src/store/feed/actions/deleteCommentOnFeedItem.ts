import {
  DeleteCommentOnFeedItemDocument,
  type IDeleteCommentOnFeedItemInput,
  type IDeleteCommentOnFeedItemMutation,
  type IDeleteCommentOnFeedItemMutationVariables,
  type IDeleteCommentOnFeedItemResponse,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type DeleteCommentOnFeedItemAction = FeedAction<IDeleteCommentOnFeedItemInput, IDeleteCommentOnFeedItemResponse>

export const deleteCommentOnFeedItem: DeleteCommentOnFeedItemAction = async ({ commit }, { postId, commentId }) => {
  const input: IDeleteCommentOnFeedItemInput = {
    postId,
    commentId,
  }

  let response
  try {
    response = await mutateApollo<IDeleteCommentOnFeedItemMutation, IDeleteCommentOnFeedItemMutationVariables>({
      mutation: DeleteCommentOnFeedItemDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.DELETE_COMMENT_ON_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.DELETE_COMMENT_ON_FEED_ITEM)
  }

  const { total } = data.deleteCommentOnFeedItem

  commit('DELETE_COMMENT_ON_FEED_ITEM', { commentId, postId, total })
  return { data: data.deleteCommentOnFeedItem }
}
