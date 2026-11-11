import gql from 'graphql-tag'

import { MessageFragment } from './messageFragment'
import { MessageParticipantFragment } from './messageParticipantFragment'

export const ConversationFragment = gql`
  fragment ConversationFragment on Conversation {
    id
    participants {
      ...MessageParticipantFragment
    }

    unreadMessagesCount

    lastMessage {
      ...MessageFragment
    }

    lastActive
    updatedAt
  }
  ${MessageFragment}
  ${MessageParticipantFragment}
`
