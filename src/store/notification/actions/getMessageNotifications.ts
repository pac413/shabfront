import { getMessageNotifications as gqlQuery } from '@/graphql/queries'
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
 * This fetches all the message notifications based on offset and limit
 */
export const getMessageNotifications: Action = async ({ commit, state }, params) => {
  if (state.messageNotificationsLoading === LoadingStatus.Loading) {
    return null
  }

  const reset = (params && params.reset) || state.messageNotificationsLoading === LoadingStatus.Unloaded
  const offset = reset ? 0 : state.messageNotifications.length

  commit('SET_MESSAGE_NOTIFICATIONS_LOADING', LoadingStatus.Loading)

  if (reset) {
    commit('SET_MESSAGE_NOTIFICATIONS', [])
  }

  let response

  try {
    response = await queryApollo({
      query: gqlQuery,
      fetchPolicy: 'network-only',
      variables: {
        offset,
        limit: NOTIFICATIONS_LIMIT,
      },
    })
  } finally {
    commit('SET_MESSAGE_NOTIFICATIONS_LOADING', LoadingStatus.Loaded)
  }

  const { notifications, total, unviewedTotal } = response.data.messageNotifications
  commit('SET_MESSAGE_NOTIFICATIONS_TOTAL', total)
  commit('SET_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL', unviewedTotal)

  if (reset) {
    commit('SET_MESSAGE_NOTIFICATIONS', notifications)
  } else {
    commit('PUSH_MESSAGE_NOTIFICATIONS', notifications)
  }
  return { notifications, total }
}
