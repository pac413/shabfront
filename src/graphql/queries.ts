import getAllConnections from './connections/getAllConnections'
import getFollowers from './follower/queries/followers'
import getFollowings from './follower/queries/followings'
import getMediaById from './media/queries/getMediaById'
import getMessageNotifications from './notification/queries/getMessageNotifications'
import getNonMessageNotifications from './notification/queries/getNonMessageNotifications'
import getNotifications from './notification/queries/getNotifications'
import unviewedMessageNotificationTotal from './notification/queries/unviewedMessageNotificationTotal'
import unviewedNonMessageNotificationTotal from './notification/queries/unviewedNonMessageNotificationTotal'
import unviewedNotificationsTotal from './notification/queries/unviewedNotificationsTotal'
import getProfileSettings from './profileSettings/queries/getProfileSettings'

export * from './blocking/queries'
export * from './friends/queries'
export * from './profile/queries'

export {
  // Notifications
  getMessageNotifications,
  getNonMessageNotifications,
  getNotifications,
  unviewedMessageNotificationTotal,
  unviewedNonMessageNotificationTotal,
  unviewedNotificationsTotal,
  // Follower
  getFollowers,
  getFollowings,
  // Profile Settings
  getProfileSettings,
  // Media
  getMediaById,
  // Connections
  getAllConnections,
}
