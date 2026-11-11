import gql from 'graphql-tag'

import { FriendProfileFragment } from '@/graphql/fragments/friendProfileFragment'
import { queryApollo } from '@/plugins/vue-apollo'
import { type Friends } from '@/types'

const FRIENDS = gql`
  query friendsV2($type: FriendsType!, $targetProfileId: String, $orderBy: FriendsOrderBy, $offset: Int!, $limit: Int!) {
    friendsV2(
      input: { type: $type, targetProfileId: $targetProfileId, orderBy: $orderBy, offset: $offset, limit: $limit }
    ) {
      profiles {
        ...FriendProfileFragment
      }
      totalCount
      mutualCount
    }
  }
  ${FriendProfileFragment}
`

type Variables = {
  type: 'mutual' | 'pending' | 'all'
  targetProfileId?: string
  orderBy?: 'mutual' | 'dateActive'
  offset: number
  limit: number
}

type ResponseData = {
  friendsV2: Friends
}

export const queryFriends = (variables: Variables) =>
  queryApollo<ResponseData>({
    query: FRIENDS,
    fetchPolicy: 'network-only',
    variables,
  })
