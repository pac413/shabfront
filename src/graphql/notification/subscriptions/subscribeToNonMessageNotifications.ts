import gql from 'graphql-tag'

import { NotificationFragment } from '@/graphql/fragments/notificationFragment'

export default gql`
  subscription subscribeToNonMessageNotifications {
    subscribeToNonMessageNotifications {
      notification {
        ...NotificationFragment
      }
      unviewedTotal
    }
  }
  ${NotificationFragment}
`
