import gql from 'graphql-tag'

import { SimpleProfileFragment } from '@/graphql/fragments/simpleProfileFragment'

export const PostLikeFragment = gql`
  fragment PostLikeFragment on PostLike {
    id
    likedBy {
      ...SimpleProfileFragment
    }
    date
  }
  ${SimpleProfileFragment}
`
