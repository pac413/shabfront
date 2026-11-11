import gql from 'graphql-tag'

export const PostShareFragment = gql`
  fragment PostShareFragment on PostShare {
    sharedTo
    sharedPostId
    sharedFeedItemId
  }
`
