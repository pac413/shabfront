import gql from 'graphql-tag'

import { FriendProfileFragment } from '@/graphql/fragments/friendProfileFragment'

const followers = gql`
  query followersV2($profileId: ID, $offset: Int, $limit: Int) {
    followersV2(input: { profileId: $profileId, offset: $offset, limit: $limit }) {
      profiles {
        ...FriendProfileFragment
      }
      total
    }
  }
  ${FriendProfileFragment}
`
export default followers
