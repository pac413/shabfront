import { type INotificationActionStyle, type INotificationActionType } from '@/composables/graphql/generated'

export type NotificationAction = {
  name: string
  label: string
  style: INotificationActionStyle
  type: INotificationActionType
  actionUrl?: string
  payload?: any
}
