import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const DELETE_HOST_SITE_ROLE = gql`
  mutation deleteHostSiteRole($profileId: ID) {
    deleteHostSiteRole(input: { id: $profileId }) {
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
  deleteHostSiteRole: {
    profile?: Profile
    error?: { message: string }
  }
}

export const deleteHostSiteRole = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: DELETE_HOST_SITE_ROLE,
    variables,
  })
