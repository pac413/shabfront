import { updateHostProfile as mutate } from '@/graphql/mutations'
import { type ProfileErrorAction } from '@/store/profile/types'
import { type HostProfile, type HostProfileStatus, type HostReserveBy } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  profileId: string
  hostingDate?: Date
  status?: HostProfileStatus
  reserveBy?: HostReserveBy
  mealAmount?: number
  sleepAmount?: number
  hostMen?: boolean
  hostWomen?: boolean
  hostFamiliesWithChildren?: boolean
  hostAffiliatedJews?: boolean
  hostUnAffiliatedJews?: boolean
  showGuestList?: boolean
}
type UpdateHostProfileAction = ProfileErrorAction<Params, HostProfile>

export const updateHostProfile: UpdateHostProfileAction = async ({ commit, state }, payload) => {
  const { hostingDate, profileId } = payload
  const variables: Parameters<typeof mutate>[0] = payload

  let response
  try {
    response = await mutate(variables)
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.UPDATE_HOST_PROFILE)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.UPDATE_HOST_PROFILE)
  }

  const { activeProfile } = state
  const { hostProfile } = data.updateHostProfile
  if (!hostProfile) {
    return createClientError(ERROR_BY_ACTION.UPDATE_HOST_PROFILE)
  }

  if (hostingDate) {
    commit('planner/SET_HOST_PROFILE_FOR_DATE', hostProfile, { root: true })
  } else if (activeProfile && activeProfile.id === profileId) {
    commit('SET_ACTIVE_HOST_PROFILE', hostProfile)
  } else {
    commit('SET_CURRENT_HOST_PROFILE', { profileId, hostProfile })
  }

  return { data: hostProfile }
}
