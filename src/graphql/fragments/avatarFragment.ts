import gql from 'graphql-tag'

export const AvatarFragment = gql`
  fragment AvatarFragment on Avatar {
    id
    originalMediaId
    small
    medium
    large
    original
  }
`
