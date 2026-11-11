import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const ADD_HOST_SITE_ROLE = gql`
  mutation addHostSiteRole($profileId: ID) {
    addHostSiteRole(input: { id: $profileId }) {
      error {
        message
      }
      profile {
        ...ProfileFragment
      }
    }
  }
  ${ProfileFragment}
`

type Variables = {
  profileId?: string
}

type ResponseData = {
  addHostSiteRole: {
    profile?: Profile
    error?: { message: string }
  }
}

export const addHostSiteRole = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: ADD_HOST_SITE_ROLE,
    variables,
  })
