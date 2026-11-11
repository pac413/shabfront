import gql from 'graphql-tag'

export const PictureFragment = gql`
  fragment PictureFragment on Picture {
    id
    originalMediaId
    medium
    large
    original
  }
`
