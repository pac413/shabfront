import {
  type IMuteConnectionInput,
  type IMuteConnectionMutation,
  type IMuteConnectionMutationVariables,
  MuteConnectionDocument,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type HideAllPostsFromAction = FeedAction<IMuteConnectionInput, { profileId: string }>

export const hideAllPostsFrom: HideAllPostsFromAction = async ({ commit }, { profileId }) => {
  const input: IMuteConnectionInput = {
    profileId,
  }

  let response
  try {
    response = await mutateApollo<IMuteConnectionMutation, IMuteConnectionMutationVariables>({
      mutation: MuteConnectionDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.HIDE_ALL_POSTS_FROM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.HIDE_ALL_POSTS_FROM)
  }
  commit('HIDE_ALL_POSTS_FROM', profileId)

  return { data: { profileId } }
}
