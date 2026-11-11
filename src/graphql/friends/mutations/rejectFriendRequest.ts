import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const REJECT_FRIEND_REQUEST = gql`
  mutation rejectRequest($requestId: ID!) {
    rejectRequest(input: { requestId: $requestId }) {
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
  rejectRequest: {
    profile: Profile
  }
}

export const rejectFriendRequest = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: REJECT_FRIEND_REQUEST,
    variables,
  })
