import gql from 'graphql-tag'

import { NotificationFragment } from '@/graphql/fragments/notificationFragment'

export default gql`
  mutation updateNotificationStatusMutation($notificationId: String!, $status: NotificationStatus!) {
    updateNotificationStatus(input: { notificationId: $notificationId, status: $status }) {
      ...NotificationFragment
    }
  }
  ${NotificationFragment}
`
