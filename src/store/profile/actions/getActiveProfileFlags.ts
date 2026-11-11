import { queryProfileFlags } from '@/graphql/queries'
import { type ProfileAction } from '@/store/profile/types'
import { type ProfileFlag } from '@/types'

export type GetActiveProfileFlagsAction = ProfileAction<void, ProfileFlag[] | null>

export const getActiveProfileFlags: GetActiveProfileFlagsAction = async ({ commit, state }) => {
  const { activeProfile } = state
  if (!activeProfile) {
    return null
  }
  const { data } = await queryProfileFlags({ id: activeProfile.id })

  // TODO: handle errors properly
  if (!data) {
    return null
  }
  const { errors, profile } = data.profile

  // TODO: handle errors properly
  if (errors || !profile) {
    return null
  }

  commit('UPDATE_ACTIVE_PROFILE', profile)

  return profile.flags || []
}
