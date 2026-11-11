import { type INotificationStatus } from '@/composables/graphql/generated'
import { updateNotificationStatus as gqlMutation } from '@/graphql/mutations'
import { mutateApollo } from '@/plugins/vue-apollo'
import { MessageNotificationTypes, type NotificationAction } from '@/store/notification/types'
import { LoadingStatus } from '@/store/types'
import { type Notification } from '@/types'

type Params = {
  notification: Notification
  newStatus: INotificationStatus
}

type Action = NotificationAction<Params, void>

export const updateNotificationStatus: Action = async ({ commit, dispatch, state }, { notification, newStatus }) => {
  const response = await mutateApollo({
    mutation: gqlMutation,
    variables: { notificationId: notification.id, status: newStatus },
  })

  const updatedNotification = response.data.updateNotificationStatus

  if (
    state.messageNotificationsLoading === LoadingStatus.Loaded &&
    MessageNotificationTypes.includes(notification.type)
  ) {
    commit('UPDATE_MESSAGE_NOTIFICATION_STATUS', updatedNotification)
    dispatch('getUnviewedMessageNotificationsTotal')
  }

  if (state.nonMessageNotificationsLoading === LoadingStatus.Loaded) {
    commit('UPDATE_NON_MESSAGE_NOTIFICATION_STATUS', updatedNotification)
    dispatch('getUnviewedNonMessageNotificationsTotal')
  }
}
