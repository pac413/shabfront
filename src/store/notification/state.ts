import { LoadingStatus } from '@/store/types'

import { type NotificationState } from './types'

export const getInitialState: () => NotificationState = () => ({
  nonMessageNotifications: [],
  nonMessageNotificationsTotal: 0,
  nonMessageNotificationsUnviewedTotal: 0,
  nonMessageNotificationsLoading: LoadingStatus.Unloaded,

  messageNotifications: [],
  messageNotificationsTotal: 0,
  messageNotificationsUnviewedTotal: 0,
  messageNotificationsLoading: LoadingStatus.Unloaded,

  currentNotification: null,
})

const state: NotificationState = getInitialState()

export default state
