import { queryProfileByHandle, queryProfileById } from '@/graphql/queries'
import type { ProfileAction } from '@/store/profile/types'
import type { Picture, Profile } from '@/types'
import { getPublicMediaUrl } from '@/utils'

export type Params = { id: string } | { handle: string }

export type GetProfileAction = ProfileAction<Params, Profile | null>

export const getProfile: GetProfileAction = async ({ commit, dispatch, rootState }, params) => {
  let response

  if ('id' in params) {
    response = await queryProfileById({ id: params.id })
  } else {
    response = await queryProfileByHandle({ handle: params.handle })
  }

  const { data } = response
  const { errors, profile } = data.profile

  // TODO: handle errors properly
  if (errors || !profile) {
    return null
  }

  profile.pictures = profile.pictures.map(
    (pic: any) =>
      ({
        ...pic,
        original: getPublicMediaUrl(pic.large || pic.original),
      } as Picture),
  )

  if (rootState.auth.profileId === profile.id) {
    commit('UPDATE_ACTIVE_PROFILE', profile)
  } else {
    commit('SET_CURRENT_PROFILE', profile)

    // We need to get connections when we get the current profile
    dispatch('connections/getConnections', { profileId: profile.id }, { root: true })
  }

  return profile
}
