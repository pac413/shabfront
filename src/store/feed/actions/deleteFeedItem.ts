import {
  DeletePostDocument,
  type IDeletePostInput,
  type IDeletePostMutation,
  type IDeletePostMutationVariables,
  type IDeletePostResponse,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type DeleteFeedItemAction = FeedAction<IDeletePostInput, IDeletePostResponse>

export const deleteFeedItem: DeleteFeedItemAction = async ({ commit }, { id }) => {
  const input: IDeletePostInput = {
    id,
  }

  let response
  try {
    response = await mutateApollo<IDeletePostMutation, IDeletePostMutationVariables>({
      mutation: DeletePostDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.DELETE_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.DELETE_FEED_ITEM)
  }
  commit('DELETE_FEED_ITEM', id)

  return { data: data.deletePost }
}
