import gql from 'graphql-tag'

import { EndorsementFragment } from './endorsementFragment'
import { ReferenceFragment } from './referenceFragment'
import { SimpleProfileFragment } from './simpleProfileFragment'

export const HostProfileFragment = gql`
  fragment HostProfileFragment on HostProfile {
    id
    hostMen
    hostWomen
    mealAmount
    sleepAmount
    hostAffiliatedJews
    hostUnAffiliatedJews
    hostFamiliesWithChildren
    showGuestList
    reserveBy
    status
    location {
      city
    }
    privateInviteEnabled
    privateInviteCode
    hostEndorsements {
      endorsements {
        ...EndorsementFragment
      }
      total
    }
    references {
      ...ReferenceFragment
    }
    unavailableGuests {
      ...SimpleProfileFragment
    }
  }
  ${EndorsementFragment}
  ${ReferenceFragment}
  ${SimpleProfileFragment}
`
