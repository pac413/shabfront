import gql from 'graphql-tag'

import { NotificationFragment } from '@/graphql/fragments/notificationFragment'

export default gql`
  query nonMessageNotifications($offset: Int!, $limit: Int!, $includeDismissed: Boolean) {
    nonMessageNotifications(input: { offset: $offset, limit: $limit, includeDismissed: $includeDismissed }) {
      total
      unviewedTotal
      notifications {
        ...NotificationFragment
      }
    }
  }
  ${NotificationFragment}
`
