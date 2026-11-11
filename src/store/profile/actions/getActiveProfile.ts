import { queryActiveProfile } from '@/graphql/queries'
import { type ProfileAction } from '@/store/profile/types'
import { type Profile } from '@/types'

export type GetActiveProfileAction = ProfileAction<void, Profile | null>

export const getActiveProfile: GetActiveProfileAction = async ({ commit, dispatch }) => {
  const { data } = await queryActiveProfile()
  const { errors, profile } = data.profile

  // TODO: handle errors properly
  if (errors || !profile) {
    return null
  }

  commit('SET_ACTIVE_PROFILE', profile)

  // We need to get connections when we get the active profile
  dispatch('connections/getConnections', { profileId: profile.id }, { root: true })

  return profile
}
