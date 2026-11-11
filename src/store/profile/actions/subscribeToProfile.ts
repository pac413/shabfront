import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { subscribeToProfile as subscribe } from '@/graphql/subscriptions'
import { type ProfileAction } from '@/store/profile/types'
import { type Picture } from '@/types'
import { getPublicMediaUrl } from '@/utils'

export type Params = string

export const subscribeToProfile: ProfileAction<Params, ZenObservable.Subscription> = async (
  { commit, state },
  profileId,
) => {
  const observer = await subscribe({ profileId })

  const subscription = observer.subscribe({
    next({ data }) {
      if (!data) {
        return
      }
      const profile = cloneDeep(data.subscribeToProfile)
      profile.pictures = profile.pictures.map(
        (pic) =>
          ({
            ...pic,
            original: getPublicMediaUrl(pic.large || pic.original),
          }) as Picture,
      )
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

  return subscription
}
