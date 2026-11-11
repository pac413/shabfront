import gql from 'graphql-tag'

import { FriendProfileFragment } from '@/graphql/fragments/friendProfileFragment'

const followings = gql`
  query followingsV2($profileId: ID, $offset: Int, $limit: Int) {
    followingsV2(input: { profileId: $profileId, offset: $offset, limit: $limit }) {
      profiles {
        ...FriendProfileFragment
      }
      total
    }
  }
  ${FriendProfileFragment}
`
export default followings
