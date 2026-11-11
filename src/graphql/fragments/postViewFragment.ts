import gql from 'graphql-tag'

import { SimpleProfileFragment } from '@/graphql/fragments/simpleProfileFragment'

export const PostViewFragment = gql`
  fragment PostViewFragment on PostView {
    id
    viewedBy {
      ...SimpleProfileFragment
    }
    date
  }
  ${SimpleProfileFragment}
`
