import gql from 'graphql-tag'

import { AvatarFragment } from './avatarFragment'
import { FriendshipFragment } from './friendshipFragment'

export const FriendProfileFragment = gql`
  fragment FriendProfileFragment on SimpleProfile {
    id
    avatar {
      ...AvatarFragment
    }
    firstName
    lastName
    displayName
    profileUrl
    handle
    isBlocked
    isBlocking
    isFollowing
    uncuratedOccupation
    about
    friendship {
      ...FriendshipFragment
    }
  }
  ${AvatarFragment}
  ${FriendshipFragment}
`
