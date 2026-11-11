import gql from 'graphql-tag'

import { EndorsementFragment } from './endorsementFragment'
import { ReferenceFragment } from './referenceFragment'

export const GuestProfileFragment = gql`
  fragment GuestProfileFragment on GuestProfile {
    id
    status
    availabilitySentence
    location {
      city
      state
    }
    guestEndorsements {
      endorsements {
        ...EndorsementFragment
      }
      total
    }
    references {
      ...ReferenceFragment
    }
  }
  ${EndorsementFragment}
  ${ReferenceFragment}
`
