import {
  DeleteLikeOnFeedItemDocument,
  type IDeleteLikeOnFeedItemInput,
  type IDeleteLikeOnFeedItemMutation,
  type IDeleteLikeOnFeedItemMutationVariables,
  type IDeleteLikeOnFeedItemResponse,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type DeleteLikeOnFeedItemAction = FeedAction<IDeleteLikeOnFeedItemInput, IDeleteLikeOnFeedItemResponse>

export const deleteLikeOnFeedItem: DeleteLikeOnFeedItemAction = async ({ commit }, { postId }) => {
  const input: IDeleteLikeOnFeedItemInput = {
    postId,
  }

  let response
  try {
    response = await mutateApollo<IDeleteLikeOnFeedItemMutation, IDeleteLikeOnFeedItemMutationVariables>({
      mutation: DeleteLikeOnFeedItemDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.DELETE_LIKE_ON_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.DELETE_LIKE_ON_FEED_ITEM)
  }

  const { likeId, total } = data.deleteLikeOnFeedItem
  commit('DELETE_FEED_ITEM_LIKE', { postId, likeId, total })

  return { data: data.deleteLikeOnFeedItem }
}
