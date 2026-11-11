import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const DELETE_GUEST_SITE_ROLE = gql`
  mutation deleteGuestSiteRole($profileId: ID) {
    deleteGuestSiteRole(input: { id: $profileId }) {
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
  deleteGuestSiteRole: {
    profile?: Profile
    error?: { message: string }
  }
}

export const deleteGuestSiteRole = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: DELETE_GUEST_SITE_ROLE,
    variables,
  })
