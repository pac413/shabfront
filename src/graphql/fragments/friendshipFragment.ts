import gql from 'graphql-tag'

export const FriendshipFragment = gql`
  fragment FriendshipFragment on Friendship {
    id
    status
    requester
  }
`
