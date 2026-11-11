import {
  HidePostFromFeedDocument,
  type IHidePostFromFeedInput,
  type IHidePostFromFeedMutation,
  type IHidePostFromFeedMutationVariables,
  type IHidePostFromFeedResponse,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type HidePostFromFeedAction = FeedAction<IHidePostFromFeedInput, IHidePostFromFeedResponse>

export const hidePostFromFeed: HidePostFromFeedAction = async ({ commit }, { id }) => {
  const input: IHidePostFromFeedInput = { id }

  let response
  try {
    response = await mutateApollo<IHidePostFromFeedMutation, IHidePostFromFeedMutationVariables>({
      mutation: HidePostFromFeedDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.HIDE_POST_FROM_FEED)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.HIDE_POST_FROM_FEED)
  }
  commit('HIDE_POST_FROM_FEED', id)

  return { data: { id } }
}
