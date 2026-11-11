import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const ADD_GUEST_SITE_ROLE = gql`
  mutation addGuestSiteRole($profileId: ID) {
    addGuestSiteRole(input: { id: $profileId }) {
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
  addGuestSiteRole: {
    profile?: Profile
    error?: { message: string }
  }
}

export const addGuestSiteRole = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: ADD_GUEST_SITE_ROLE,
    variables,
  })
