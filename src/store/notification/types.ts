import { INotificationType } from '@/composables/graphql/generated'
import { type LoadingStatus, type TypedAction, type TypedErrorAction, type TypedMutation } from '@/store/types'
import { type Notification } from '@/types'

export type NotificationState = {
  nonMessageNotifications: Notification[]
  nonMessageNotificationsTotal: number
  nonMessageNotificationsUnviewedTotal: number
  nonMessageNotificationsLoading: LoadingStatus

  messageNotifications: Notification[]
  messageNotificationsTotal: number
  messageNotificationsUnviewedTotal: number
  messageNotificationsLoading: LoadingStatus

  // TODO: This is a temporary solution to show the toast for incoming messages. should be updated to acommodate more notifications list
  currentNotification: Notification | null
}

export type NotificationAction<T, R = any> = TypedAction<NotificationState, T, R>
/**
 * TODO:
 *  We would need to finally replace `NotificationAction` with `NotificationErrorAction` type
 *  to handle errors properly
 */
export type NotificationErrorAction<T, R = any> = TypedErrorAction<NotificationState, T, R>
export type NotificationMutation<P = any> = TypedMutation<NotificationState, P>

export const NOTIFICATIONS_LIMIT = 20

export const MessageNotificationTypes = [
  INotificationType.NewMessage,
  INotificationType.MessageRequest,
  INotificationType.MessageRequestApproved,
  INotificationType.MessageRequestRejected,
]
