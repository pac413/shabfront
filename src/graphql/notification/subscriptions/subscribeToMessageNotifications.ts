import gql from 'graphql-tag'

import { NotificationFragment } from '@/graphql/fragments/notificationFragment'

export default gql`
  subscription subscribeToMessageNotifications {
    subscribeToMessageNotifications {
      notification {
        ...NotificationFragment
      }
      unviewedTotal
    }
  }
  ${NotificationFragment}
`
