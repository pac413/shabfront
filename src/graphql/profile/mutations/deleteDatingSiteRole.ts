import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const DELETE_DATING_SITE_ROLE = gql`
  mutation deleteDatingSiteRole($profileId: ID) {
    deleteDatingSiteRole(input: { id: $profileId }) {
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
  deleteDatingSiteRole: {
    profile?: Profile
    error?: { message: string }
  }
}

export const deleteDatingSiteRole = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: DELETE_DATING_SITE_ROLE,
    variables,
  })
