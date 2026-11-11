import gql from 'graphql-tag'

import { MediaFragment } from './mediaFragment'
import { MessageReactionFragment } from './messageReactionFragment'
import { MessageStatusFragment } from './messageStatusFragment'
import { SimpleProfileFragment } from './simpleProfileFragment'
import { WebScrapedBasicFragment } from './webScrapedBasicFragment'

export const MessageFragment = gql`
  fragment MessageFragment on Message {
    id
    text
    type
    date
    isBroadcastMessage
    sender {
      ...SimpleProfileFragment
    }
    status {
      ...MessageStatusFragment
    }
    attachments {
      ...MediaFragment
    }
    webScraped {
      ...WebScrapedBasicFragment
    }
    reactions {
      ...MessageReactionFragment
    }
  }
  ${MediaFragment}
  ${MessageStatusFragment}
  ${SimpleProfileFragment}
  ${WebScrapedBasicFragment}
  ${MessageReactionFragment}
`
