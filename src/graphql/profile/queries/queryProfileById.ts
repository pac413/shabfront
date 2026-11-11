import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { queryApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const PROFILE_BY_ID = gql`
  query profile($id: ID!) {
    profile(input: { id: $id }) {
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
  id: string
}

type ResponseData = {
  profile: {
    profile?: Profile
    errors: { message: string }
  }
}

export const queryProfileById = (variables: Variables) =>
  queryApollo<ResponseData>({
    query: PROFILE_BY_ID,
    fetchPolicy: 'network-only',
    variables,
  })
