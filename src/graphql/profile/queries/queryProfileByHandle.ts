import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { queryApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const PROFILE_BY_HANDLE = gql`
  query profile($handle: String) {
    profile(input: { handle: $handle }) {
      profile {
        ...ProfileFragment
      }
      errors {
        message
      }
    }
  }
  ${ProfileFragment}
`

type Variables = {
  handle: string
}

type ResponseData = {
  profile: {
    profile?: Profile
    errors: { message: string }
  }
}

export const queryProfileByHandle = (variables: Variables) =>
  queryApollo<ResponseData>({
    query: PROFILE_BY_HANDLE,
    fetchPolicy: 'network-only',
    variables,
  })
