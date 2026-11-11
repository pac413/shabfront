import gql from 'graphql-tag'

import { queryApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const PROFILE_BY_ID = gql`
  query profile($id: ID!) {
    profile(input: { id: $id }) {
      profile {
        id
        flags {
          code
          scopes
        }
      }
    }
  }
`

type Variables = {
  id: string
}

type ResponseData = {
  profile: {
    profile?: Pick<Profile, 'id' | 'flags'>
    errors: { message: string }
  }
}

export const queryProfileFlags = (variables: Variables) =>
  queryApollo<ResponseData>({
    query: PROFILE_BY_ID,
    fetchPolicy: 'network-only',
    variables,
  })
