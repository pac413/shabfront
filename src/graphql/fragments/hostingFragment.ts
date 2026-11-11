import gql from 'graphql-tag'

import { SimpleProfileFragment } from '@/graphql/fragments/simpleProfileFragment'

export const HostingFragment = gql`
  fragment HostingFragment on Hosting {
    id
    host {
      ...SimpleProfileFragment
    }
    guest {
      ...SimpleProfileFragment
    }
    status
    type
    date
    sharedParts
    guestParts
    hostParts
    notes {
      sender
      body
    }
  }
  ${SimpleProfileFragment}
`
