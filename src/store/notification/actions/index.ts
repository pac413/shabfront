import { type ActionTree } from 'vuex'

import { type NotificationState } from '@/store/notification/types'
import { type RootState } from '@/store/types'

import { getMessageNotifications } from './getMessageNotifications'
import { getNonMessageNotifications } from './getNonMessageNotifications'
import { getUnviewedMessageNotificationsTotal } from './getUnviewedMessageNotificationsTotal'
import { getUnviewedNonMessageNotificationsTotal } from './getUnviewedNonMessageNotificationsTotal'
import { reloadNotifications } from './reloadNotifications'
import { subscribeToMessageNotifications } from './subscribeToMessageNotifications'
import { subscribeToNonMessageNotifications } from './subscribeToNonMessageNotifications'
import { updateNotificationStatus } from './updateNotificationStatus'

const actions: ActionTree<NotificationState, RootState> = {
  getMessageNotifications,
  getNonMessageNotifications,
  getUnviewedMessageNotificationsTotal,
  getUnviewedNonMessageNotificationsTotal,
  reloadNotifications,
  subscribeToMessageNotifications,
  subscribeToNonMessageNotifications,
  updateNotificationStatus,
}

export default actions
