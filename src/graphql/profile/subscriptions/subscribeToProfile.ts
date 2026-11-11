import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { apolloClient } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const SUBSCRIBE_TO_PROFILE = gql`
  subscription subscribeToProfile($profileId: ID!) {
    subscribeToProfile(input: { profileId: $profileId }) {
      ...ProfileFragment
    }
  }
  ${ProfileFragment}
`

type Variables = {
  profileId: string
}

type ResponseData = {
  subscribeToProfile: Profile
}

/**
 * Subscribes to the full profile updates
 */
export const subscribeToProfile = (variables: Variables) =>
  apolloClient.subscribe<ResponseData>({
    query: SUBSCRIBE_TO_PROFILE,
    fetchPolicy: 'network-only',
    variables,
  })
