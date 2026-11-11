import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { subscribeToMessageNotifications as gqlSubscription } from '@/graphql/subscriptions'
import { apolloClient } from '@/plugins/vue-apollo'
import { type NotificationAction } from '@/store/notification/types'

type Action = NotificationAction<{}, ZenObservable.Subscription | null>

export const subscribeToMessageNotifications: Action = async ({ commit }) => {
  const observer = await apolloClient.subscribe({
    query: gqlSubscription,
  })

  const subscription = observer.subscribe({
    next(response: any) {
      const { notification, unviewedTotal } = cloneDeep(response.data.subscribeToMessageNotifications)
      commit('SET_CURRENT_NOTIFICATION', notification)
      commit('PREPEND_MESSAGE_NOTIFICATION', notification)
      commit('SET_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL', unviewedTotal)
    },
    error(err: any) {
      console.error(err)
    },
  })

  return { data: subscription }
}
