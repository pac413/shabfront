import gql from 'graphql-tag'

import { mutateApollo } from '@/plugins/vue-apollo'

const REMOVE_FRIEND = gql`
  mutation removeFriend($requestId: ID!) {
    removeFriend(input: { requestId: $requestId })
  }
`

type Variables = {
  requestId: string
}

type ResponseData = {
  removeFriend: boolean
}

export const removeFriend = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: REMOVE_FRIEND,
    variables,
  })
