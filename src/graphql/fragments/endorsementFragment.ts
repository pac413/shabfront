import gql from 'graphql-tag'

import { SimpleProfileFragment } from './simpleProfileFragment'

export const EndorsementFragment = gql`
  fragment EndorsementFragment on Endorsement {
    endorser {
      ...SimpleProfileFragment
    }
    id
    body
    date
  }
  ${SimpleProfileFragment}
`
