import { type MutationTree } from 'vuex'

import { INotificationStatus } from '@/composables/graphql/generated'
import { type LoadingStatus } from '@/store/types'
import { type Notification } from '@/types'

import { type NotificationState } from './types'

const mutations: MutationTree<NotificationState> = {
  SET_CURRENT_NOTIFICATION(state: NotificationState, notification: Notification) {
    state.currentNotification = notification
  },

  SET_NON_MESSAGE_NOTIFICATIONS_LOADING(state: NotificationState, loading: LoadingStatus) {
    state.nonMessageNotificationsLoading = loading
  },

  SET_NON_MESSAGE_NOTIFICATIONS_TOTAL(state: NotificationState, total: number) {
    state.nonMessageNotificationsTotal = total
  },

  SET_NON_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL(state: NotificationState, unviewedTotal: number) {
    state.nonMessageNotificationsUnviewedTotal = unviewedTotal
  },

  SET_NON_MESSAGE_NOTIFICATIONS(state: NotificationState, notifications: Notification[]) {
    state.nonMessageNotifications = notifications
  },

  PUSH_NON_MESSAGE_NOTIFICATIONS(state: NotificationState, notifications: Notification[]) {
    state.nonMessageNotifications.push(...notifications)
  },

  PREPEND_NON_MESSAGE_NOTIFICATION(state: NotificationState, notification: Notification) {
    const idx = state.nonMessageNotifications.findIndex((n) => n.id === notification.id)
    if (idx < 0) {
      state.nonMessageNotifications.unshift(notification)
      state.nonMessageNotificationsTotal++
    } else {
      state.nonMessageNotifications.splice(idx, 1, notification)
    }
  },

  UPDATE_NON_MESSAGE_NOTIFICATION_STATUS(state: NotificationState, notification: Notification) {
    const idx = state.nonMessageNotifications.findIndex((n) => n.id === notification.id)
    if (idx < 0) {
      return
    }
    if (notification.status === INotificationStatus.Dismissed) {
      state.nonMessageNotifications.splice(idx, 1)
      state.nonMessageNotificationsTotal--
    } else {
      state.nonMessageNotifications[idx].status = notification.status
    }
  },

  DELETE_NON_MESSAGE_NOTIFICATION(state: NotificationState, notification: Notification) {
    const idx = state.nonMessageNotifications.findIndex((n) => n.id === notification.id)
    if (idx > -1) {
      state.nonMessageNotifications.splice(idx, 1)
    }
  },

  SET_MESSAGE_NOTIFICATIONS_LOADING(state: NotificationState, loading: LoadingStatus) {
    state.messageNotificationsLoading = loading
  },

  SET_MESSAGE_NOTIFICATIONS_TOTAL(state: NotificationState, total: number) {
    state.messageNotificationsTotal = total
  },

  SET_MESSAGE_NOTIFICATIONS_UNVIEWED_TOTAL(state: NotificationState, unviewedTotal: number) {
    state.messageNotificationsUnviewedTotal = unviewedTotal
  },

  SET_MESSAGE_NOTIFICATIONS(state: NotificationState, notifications: Notification[]) {
    state.messageNotifications = notifications
  },

  PUSH_MESSAGE_NOTIFICATIONS(state: NotificationState, notifications: Notification[]) {
    state.messageNotifications.push(...notifications)
  },

  PREPEND_MESSAGE_NOTIFICATION(state: NotificationState, notification: Notification) {
    const idx = state.messageNotifications.findIndex((n) => n.id === notification.id)
    if (idx < 0) {
      state.messageNotifications.unshift(notification)
      state.messageNotificationsTotal++
    } else {
      state.messageNotifications.splice(idx, 1, notification)
    }
  },

  UPDATE_MESSAGE_NOTIFICATION_STATUS(state: NotificationState, notification: Notification) {
    const idx = state.messageNotifications.findIndex((n) => n.id === notification.id)
    if (idx < 0) {
      return
    }
    if (notification.status === INotificationStatus.Dismissed) {
      state.messageNotifications.splice(idx, 1)
      state.messageNotificationsTotal--
    } else {
      state.messageNotifications[idx].status = notification.status
    }
  },

  DELETE_MESSAGE_NOTIFICATION(state: NotificationState, notification: Notification) {
    const idx = state.messageNotifications.findIndex((n) => n.id === notification.id)
    if (idx > -1) {
      state.messageNotifications.splice(idx, 1)
    }
  },
}

export default mutations
