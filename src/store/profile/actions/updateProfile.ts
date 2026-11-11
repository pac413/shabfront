import { updateProfile as mutate, type UpdateProfileInput } from '@/graphql/mutations'
import { type ProfileAction } from '@/store/profile/types'

export type Params = UpdateProfileInput

export const updateProfile: ProfileAction<Params, void> = async ({ commit, state }, params) => {
  const { data } = await mutate({ input: params })
  // TODO: handle errors properly
  if (!data) {
    return
  }

  const { error, profile } = data.updateProfile
  // TODO: handle errors properly
  if (error || !profile) {
    return
  }

  if (state.activeProfile && params.id === state.activeProfile.id) {
    commit('SET_ACTIVE_PROFILE', profile)
  } else {
    commit('PUSH_PROFILE', profile)
  }
}
