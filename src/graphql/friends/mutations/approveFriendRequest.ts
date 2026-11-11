import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FriendshipStatus, type Profile } from '@/types'

const APPROVE_FRIEND_REQUEST = gql`
  mutation approveRequest($requestId: ID!) {
    approveRequest(input: { requestId: $requestId }) {
      status
      profile {
        ...ProfileFragment
      }
    }
  }
  ${ProfileFragment}
`

type Variables = {
  requestId: string
}

type ResponseData = {
  approveRequest: {
    status: FriendshipStatus
    profile: Profile
  }
}

export const approveFriendRequest = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: APPROVE_FRIEND_REQUEST,
    variables,
  })
