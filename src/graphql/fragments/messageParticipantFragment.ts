import gql from 'graphql-tag'

import { SimpleProfileFragment } from './simpleProfileFragment'

export const MessageParticipantFragment = gql`
  fragment MessageParticipantFragment on ConversationParticipant {
    profile {
      ...SimpleProfileFragment
    }
    status
  }
  ${SimpleProfileFragment}
`
