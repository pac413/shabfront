import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { subscribeToSimpleProfiles as subscribe } from '@/graphql/subscriptions'
import { type ProfileAction } from '@/store/profile/types'

export type Params = {
  profileIds: string[]
  reset: boolean
}

export const subscribeToSimpleProfiles: ProfileAction<Params, ZenObservable.Subscription> = async (
  { commit, state },
  params,
) => {
  const { profileIds, reset } = params

  // merge profileIds param into an existing profileIds in the store, and remove duplications
  let updatedProfileIds = (() => {
    if (reset) {
      return profileIds
    }
    return state.profilesSubscriptionIds.concat(profileIds)
  })()
  updatedProfileIds = updatedProfileIds.filter((item, pos) => updatedProfileIds.indexOf(item) === pos)

  const observer = await subscribe({ profileIds: updatedProfileIds })

  const subscription = observer.subscribe({
    next({ data }) {
      if (!data) {
        return
      }
      const profile = cloneDeep(data.subscribeToSimpleProfiles)
      if (profile.id === state.activeProfile!.id) {
        commit('SET_ACTIVE_PROFILE', {
          ...state.activeProfile,
          ...profile,
        })
      } else {
        commit('PUSH_PROFILE', profile)
      }
    },
    error(err: any) {
      console.error(err)
    },
  })

  commit('SET_PROFILES_SUBSCRIPTION', { profileIds: updatedProfileIds })
  return subscription
}
