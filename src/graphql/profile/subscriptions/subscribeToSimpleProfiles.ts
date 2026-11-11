import gql from 'graphql-tag'

import { SimpleProfileFragment } from '@/graphql/fragments/simpleProfileFragment'
import { apolloClient } from '@/plugins/vue-apollo'
import { type SimpleProfile } from '@/types'

const SUBSCRIBE_TO_SIMPLE_PROFILES = gql`
  subscription subscribeToSimpleProfiles($profileIds: [ID]!) {
    subscribeToSimpleProfiles(input: { profileIds: $profileIds }) {
      ...SimpleProfileFragment
    }
  }
  ${SimpleProfileFragment}
`

type Variables = {
  profileIds: string[]
}

type ResponseData = {
  subscribeToSimpleProfiles: SimpleProfile
}

/**
 * Subscribes to the simple profile updates
 */
export const subscribeToSimpleProfiles = (variables: Variables) =>
  apolloClient.subscribe<ResponseData>({
    query: SUBSCRIBE_TO_SIMPLE_PROFILES,
    fetchPolicy: 'network-only',
    variables,
  })
