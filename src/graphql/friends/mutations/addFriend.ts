import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FriendshipStatus, type Profile } from '@/types'

const ADD_FRIEND = gql`
  mutation addFriend($profileId: ID!) {
    addFriend(input: { profileId: $profileId }) {
      id
      status
      profile {
        ...ProfileFragment
      }
    }
  }
  ${ProfileFragment}
`

type Variables = {
  profileId: string
}

type ResponseData = {
  addFriend: {
    id: string
    status: FriendshipStatus
    profile: Profile
  }
}

export const addFriend = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: ADD_FRIEND,
    variables,
  })
