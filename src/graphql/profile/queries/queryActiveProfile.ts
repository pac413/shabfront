import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { queryApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const ACTIVE_PROFILE = gql`
  query profile {
    profile {
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

type ResponseData = {
  profile: {
    profile?: Profile
    errors?: { message: string }
  }
}

export const queryActiveProfile = () =>
  queryApollo<ResponseData>({
    query: ACTIVE_PROFILE,
    fetchPolicy: 'network-only',
  })
