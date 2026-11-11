import gql from 'graphql-tag'

import { AvatarFragment } from './avatarFragment'

export const RequestProfileFragment = gql`
  fragment RequestProfileFragment on SimpleProfile {
    id
    handle
    avatar {
      ...AvatarFragment
    }
    firstName
    lastName
  }
  ${AvatarFragment}
`
