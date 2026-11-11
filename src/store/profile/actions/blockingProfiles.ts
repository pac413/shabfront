import { queryBlockingProfiles } from '@/graphql/queries'
import { type ProfileAction } from '@/store/profile/types'
import { type SimpleProfile } from '@/types'

export type BlockingProfileAction = ProfileAction<string, SimpleProfile[] | null>

export const blockingProfiles: BlockingProfileAction = async ({ commit }, profileId) => {
  // Clear the state for profileId
  commit('SET_BLOCKING_PROFILES', { profileId, blockingProfiles: [] })

  const { data } = await queryBlockingProfiles(profileId)
  // TODO: handle errors properly
  commit('SET_BLOCKING_PROFILES', { profileId, blockingProfiles: data.blockingProfiles })

  // We need to get connections when we get the active profile

  return data.blockingProfiles
}
