import {
  type IProfileFragmentFragment,
  type IUnblockProfileMutation,
  type IUnblockProfileMutationVariables,
  UnblockProfileDocument,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type ProfileErrorAction } from '@/store/profile/types'
import { type Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type UnblockProfileAction = ProfileErrorAction<
  { profile: Profile; onbehalf?: Profile },
  IProfileFragmentFragment
>

export const unblockProfile: UnblockProfileAction = async ({ commit, dispatch, state }, { profile, onbehalf }) => {
  const variables: IUnblockProfileMutationVariables = {
    profileId: profile.id,
    onbehalf: onbehalf?.id,
  }

  let response
  try {
    response = await mutateApollo<IUnblockProfileMutation>({
      mutation: UnblockProfileDocument,
      variables,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.UNBLOCK_PROFILE)
  }
  const data = response.data
  if (!data?.unblockProfileV2 || 'message' in data?.unblockProfileV2) {
    return createClientError(ERROR_BY_ACTION.UNBLOCK_PROFILE)
  }

  const onbehalfId = onbehalf ? onbehalf.id : state.activeProfile!.id
  commit('REMOVE_BLOCKING_PROFILE', { profile, onbehalfId })
  commit('SET_IS_BLOCKING', { profile, isBlocking: false })
  dispatch('notification/reloadNotifications', {}, { root: true })

  return { data: data.unblockProfileV2 }
}
