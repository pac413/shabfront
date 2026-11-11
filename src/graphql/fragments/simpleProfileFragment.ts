import gql from 'graphql-tag'

import { AvatarFragment } from './avatarFragment'
import { LocationFragment } from './locationFragment'

export const SimpleProfileFragment = gql`
  fragment SimpleProfileFragment on SimpleProfile {
    id
    avatar {
      ...AvatarFragment
    }
    firstName
    lastName
    displayName
    email
    phone
    profileUrl
    handle
    isBlocked
    isBlocking
    isFollowing
    occupation
    uncuratedOccupation
    about
    primaryLocation {
      ...LocationFragment
    }
    siteRoles
  }
  ${AvatarFragment}
  ${LocationFragment}
`
