import gql from 'graphql-tag'

import { AvatarFragment } from './avatarFragment'
import { DatingFragment } from './datingFragment'
import { EndorsementFragment } from './endorsementFragment'
import { FriendshipFragment } from './friendshipFragment'
import { GuestProfileFragment } from './guestProfileFragment'
import { HostProfileFragment } from './hostProfileFragment'
import { LocationFragment } from './locationFragment'
import { PictureFragment } from './pictureFragment'
import { ReferenceFragment } from './referenceFragment'
import { WallpaperFragment } from './wallpaperFragment'

export const ProfileFragment = gql`
  fragment ProfileFragment on Profile {
    id
    firstName
    lastName
    displayName
    title
    primaryLocale
    avatar {
      ...AvatarFragment
    }
    wallpaper {
      ...WallpaperFragment
    }
    primaryLocation {
      ...LocationFragment
    }
    handle
    isBlocked
    isBlocking
    profileUrl
    pictures {
      ...PictureFragment
    }

    isFollowing
    birthday
    gender
    occupation
    occupationId
    uncuratedOccupation
    organization
    religiousAffiliation
    about
    isMarried
    spouse
    children
    siteRoles
    dateActive
    createdAt
    datingProfile {
      ...DatingFragment
    }
    hostProfile {
      ...HostProfileFragment
    }
    guestProfile {
      ...GuestProfileFragment
    }
    friendship {
      ...FriendshipFragment
    }
    totals {
      views
      invites
      connections
    }
    isPushSupported
    olamiContactMe

    # Admin / Self information
    email
    phone
    references {
      ...ReferenceFragment
    }
  }
  ${AvatarFragment}
  ${DatingFragment}
  ${EndorsementFragment}
  ${GuestProfileFragment}
  ${HostProfileFragment}
  ${LocationFragment}
  ${PictureFragment}
  ${ReferenceFragment}
  ${WallpaperFragment}
  ${FriendshipFragment}
`
