import {
  type IPostComment,
  type IUpdateCommentOnFeedItemInput,
  type IUpdateCommentOnFeedItemMutation,
  type IUpdateCommentOnFeedItemMutationVariables,
  UpdateCommentOnFeedItemDocument,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type UpdateCommentOnFeedItemAction = FeedAction<IUpdateCommentOnFeedItemInput, IPostComment>

export const updateCommentOnFeedItem: UpdateCommentOnFeedItemAction = async (
  { commit },
  { commentId, content, postId, webScraped },
) => {
  const input: IUpdateCommentOnFeedItemInput = {
    commentId,
    content,
    postId,
    webScraped,
  }

  let response
  try {
    response = await mutateApollo<IUpdateCommentOnFeedItemMutation, IUpdateCommentOnFeedItemMutationVariables>({
      mutation: UpdateCommentOnFeedItemDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_COMMENT_ON_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_COMMENT_ON_FEED_ITEM)
  }
  const comment = data.updateCommentOnFeedItem

  commit('PUSH_FEED_ITEM_COMMENT', { comment, postId })

  return { data: comment }
}
