import gql from 'graphql-tag'

import { MediaFragment } from '@/graphql/fragments/mediaFragment'

export default gql`
  query getMedia($id: ID!) {
    getMedia(input: { id: $id }) {
      media {
        ...MediaFragment
      }
    }
  }
  ${MediaFragment}
`
