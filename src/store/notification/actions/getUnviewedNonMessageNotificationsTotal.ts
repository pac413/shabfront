import { unviewedNonMessageNotificationTotal as gqlQuery } from '@/graphql/queries'
import { queryApollo } from '@/plugins/vue-apollo'
import { type NotificationAction } from '@/store/notification/types'

type Action = NotificationAction<{}, void>

/**
 * This fetches count of unviewed non-message notifications
 */
export const getUnviewedNonMessageNotificationsTotal: Action = async ({ commit }) => {
  const response = await queryApollo({
    query: gqlQuery,
    fetchPolicy: 'network-only',
  })
  commit(
    'SET_NON_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL',
    response.data.unviewedNonMessageNotificationTotal.unviewedTotal,
  )
}
