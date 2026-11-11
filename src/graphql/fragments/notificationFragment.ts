import gql from 'graphql-tag'

import { SimpleProfileFragment } from './simpleProfileFragment'

export const NotificationFragment = gql`
  fragment NotificationFragment on Notification {
    id
    type
    triggeredBy {
      ...SimpleProfileFragment
    }
    title
    content
    status
    actions {
      name
      label
      style
      type
      payload
      actionUrl
    }
    createdAt
    updatedAt
  }
  ${SimpleProfileFragment}
`
