import gql from 'graphql-tag'

import { mutateApollo } from '@/plugins/vue-apollo'

const CANCEL_FRIEND_REQUEST = gql`
  mutation cancelRequest($requestId: ID!) {
    cancelRequest(input: { requestId: $requestId })
  }
`

type Variables = {
  requestId: string
}

type ResponseData = {
  cancelRequest: boolean
}

export const cancelFriendRequest = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: CANCEL_FRIEND_REQUEST,
    variables,
  })
