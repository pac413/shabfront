import type { ProfileMutation } from '@/store/profile/types'
import type { Profile } from '@/types'

type Payload = {
  profile: Profile
  isBlocking: boolean
}

export const SET_IS_BLOCKING: ProfileMutation<Payload> = (state, payload) => {
  const { isBlocking } = payload
  payload.profile = {
    ...payload.profile,
    isBlocking,
  }
}
