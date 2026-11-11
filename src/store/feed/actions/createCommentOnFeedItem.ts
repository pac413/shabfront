import {
  CreateCommentOnFeedItemDocument,
  type ICreateCommentOnFeedItemInput,
  type ICreateCommentOnFeedItemMutation,
  type ICreateCommentOnFeedItemMutationVariables,
  type IPostComment,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type CreateCommentOnFeedItemAction = FeedAction<ICreateCommentOnFeedItemInput, IPostComment>

export const createCommentOnFeedItem: CreateCommentOnFeedItemAction = async (
  { commit },
  { postId, content, webScraped },
) => {
  const input: ICreateCommentOnFeedItemInput = {
    postId,
    content,
    webScraped,
  }

  let response
  try {
    response = await mutateApollo<ICreateCommentOnFeedItemMutation, ICreateCommentOnFeedItemMutationVariables>({
      mutation: CreateCommentOnFeedItemDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_COMMENT_ON_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_COMMENT_ON_FEED_ITEM)
  }
  const comment = data.createCommentOnFeedItem

  commit('PUSH_FEED_ITEM_COMMENT', { comment, postId })

  return { data: comment }
}
