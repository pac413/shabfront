import gql from 'graphql-tag'

import { ProfileFragment } from './profileFragment'

export const FlaggedContentFragment = gql`
  fragment FlaggedContentFragment on FlaggedContent {
    id
    resourceId
    type
    reason
    reportedBy {
      ...ProfileFragment
      isZealot
      isGreenlight
    }
    ownedBy {
      ...ProfileFragment
    }
    createdAt
  }
  ${ProfileFragment}
`
