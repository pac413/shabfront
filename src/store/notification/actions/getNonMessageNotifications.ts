import { getNonMessageNotifications as gqlQuery } from '@/graphql/queries'
import { queryApollo } from '@/plugins/vue-apollo'
import { type NotificationAction, NOTIFICATIONS_LIMIT } from '@/store/notification/types'
import { LoadingStatus } from '@/store/types'
import { type Notification } from '@/types'

type Params = {
  reset?: boolean
  includeDismissed?: boolean
}
type Response = {
  notifications: Notification[]
  total: number
} | null

type Action = NotificationAction<Params, Response>

/**
 * Fetches all the non-message notifications based on offset and limit
 */
export const getNonMessageNotifications: Action = async ({ commit, state }, params) => {
  if (state.nonMessageNotificationsLoading === LoadingStatus.Loading) {
    return null
  }

  const reset = params && params.reset
  const includeDismissed = params && params.includeDismissed
  const offset = reset ? 0 : state.nonMessageNotifications.length

  if (reset) {
    commit('SET_MESSAGE_NOTIFICATIONS', [])
  }

  commit('SET_NON_MESSAGE_NOTIFICATIONS_LOADING', LoadingStatus.Loading)

  let response

  try {
    response = await queryApollo({
      query: gqlQuery,
      fetchPolicy: 'network-only',
      variables: {
        offset,
        limit: NOTIFICATIONS_LIMIT,
        includeDismissed,
      },
    })
  } finally {
    commit('SET_NON_MESSAGE_NOTIFICATIONS_LOADING', LoadingStatus.Loaded)
  }

  const { notifications, total, unviewedTotal } = response.data.nonMessageNotifications
  commit('SET_NON_MESSAGE_NOTIFICATIONS_TOTAL', total)
  commit('SET_NON_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL', unviewedTotal)

  if (reset) {
    commit('SET_NON_MESSAGE_NOTIFICATIONS', notifications)
  } else {
    commit('PUSH_NON_MESSAGE_NOTIFICATIONS', notifications)
  }
  return { notifications, total }
}
