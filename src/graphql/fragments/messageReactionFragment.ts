import gql from 'graphql-tag'

import { SimpleProfileFragment } from './simpleProfileFragment'

export const MessageReactionFragment = gql`
  fragment MessageReactionFragment on MessageReaction {
    id
    reaction
    reactedBy {
      ...SimpleProfileFragment
    }
    date
  }
  ${SimpleProfileFragment}
`
