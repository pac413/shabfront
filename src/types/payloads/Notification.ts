import { type INotificationStatus, type INotificationType } from '@/composables/graphql/generated'
import { type NotificationAction } from '@/types'

import { type Profile } from './Profile'

export type Notification = {
  id: string
  triggeredBy: Pick<Profile, 'id' | 'firstName' | 'lastName' | 'handle' | 'avatar'>
  type: INotificationType
  title: string
  content: string
  status: INotificationStatus
  actions: NotificationAction[]
  createdAt: string
  updatedAt: string
}
