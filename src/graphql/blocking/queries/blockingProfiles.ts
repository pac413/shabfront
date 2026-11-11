import gql from 'graphql-tag'

import { SimpleProfileFragment } from '@/graphql/fragments/simpleProfileFragment'
import { queryApollo } from '@/plugins/vue-apollo'
import { type SimpleProfile } from '@/types'

export const BLOCKING_PROFILES = gql`
  query blockingProfiles($profileId: ID) {
    blockingProfiles(profileId: $profileId) {
      ...SimpleProfileFragment
    }
  }
  ${SimpleProfileFragment}
`

type ResponseData = {
  blockingProfiles: [SimpleProfile]
}

export const queryBlockingProfiles = (profileId: string) =>
  queryApollo<ResponseData>({
    query: BLOCKING_PROFILES,
    fetchPolicy: 'network-only',
    variables: {
      profileId,
    },
  })
