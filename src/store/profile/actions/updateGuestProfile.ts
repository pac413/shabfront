import { updateGuestProfile as mutate } from '@/graphql/mutations'
import { type ProfileErrorAction } from '@/store/profile/types'
import { type GuestAvailabilityStatus, type GuestProfile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  profileId: string
  status: GuestAvailabilityStatus
}
type UpdateGuestProfileAction = ProfileErrorAction<Params, GuestProfile>

export const updateGuestProfile: UpdateGuestProfileAction = async ({ commit, state }, payload) => {
  const { profileId } = payload
  const variables: Parameters<typeof mutate>[0] = payload

  let response
  try {
    response = await mutate(variables)
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.UPDATE_GUEST_PROFILE)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.UPDATE_GUEST_PROFILE)
  }

  const { activeProfile } = state
  const { guestProfile } = data.updateGuestProfile
  if (!guestProfile) {
    return createClientError(ERROR_BY_ACTION.UPDATE_GUEST_PROFILE)
  }

  if (activeProfile && activeProfile.id === profileId) {
    commit('SET_ACTIVE_GUEST_PROFILE', guestProfile)
  } else {
    commit('SET_CURRENT_GUEST_PROFILE', { profileId, guestProfile })
  }

  return { data: guestProfile }
}
