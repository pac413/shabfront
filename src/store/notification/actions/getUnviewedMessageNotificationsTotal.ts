import { unviewedMessageNotificationTotal as gqlQuery } from '@/graphql/queries'
import { queryApollo } from '@/plugins/vue-apollo'
import { type NotificationAction } from '@/store/notification/types'

type Action = NotificationAction<{}, void>

/**
 * This fetches count of unviewed message notifications
 */
export const getUnviewedMessageNotificationsTotal: Action = async ({ commit }) => {
  const response = await queryApollo({
    query: gqlQuery,
    fetchPolicy: 'network-only',
  })
  commit('SET_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL', response.data.unviewedMessageNotificationTotal.unviewedTotal)
}
