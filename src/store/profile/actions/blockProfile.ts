import {
  BlockProfileDocument,
  type IBlockProfileMutation,
  type IBlockProfileMutationVariables,
  type IProfileFragmentFragment,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type ProfileErrorAction } from '@/store/profile/types'
import { type Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type BlockProfileAction = ProfileErrorAction<Profile, IProfileFragmentFragment>

export const blockProfile: BlockProfileAction = async ({ commit, dispatch }, profile) => {
  const variables: IBlockProfileMutationVariables = {
    profileId: profile.id,
  }

  let response
  try {
    response = await mutateApollo<IBlockProfileMutation>({
      mutation: BlockProfileDocument,
      variables,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.BLOCK_PROFILE)
  }
  const data = response.data
  if (!data?.blockProfileV2 || 'message' in data?.blockProfileV2) {
    return createClientError(ERROR_BY_ACTION.BLOCK_PROFILE)
  }

  commit('SET_IS_BLOCKING', { profile, isBlocking: true })
  commit('connections/REMOVE_CONNECTION', { profileId: profile.id }, { root: true })
  commit('connections/REMOVE_MY_CONNECTION', { profileId: profile.id }, { root: true })
  dispatch('notification/reloadNotifications', {}, { root: true })

  return { data: data.blockProfileV2 }
}
