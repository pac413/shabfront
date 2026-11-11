import { type NotificationAction } from '@/store/notification/types'

type Action = NotificationAction<{}, void>

/**
 * Refresh all the notifications
 */
export const reloadNotifications: Action = async ({ dispatch }) => {
  await Promise.all([
    dispatch('getMessageNotifications', { reset: true }),
    dispatch('getUnviewedMessageNotificationsTotal'),
    dispatch('getNonMessageNotifications', { reset: true }),
    dispatch('getUnviewedNonMessageNotificationsTotal'),
  ])
}
