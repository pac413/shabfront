import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Profile } from '@/types'

const ADD_DATING_SITE_ROLE = gql`
  mutation addDatingSiteRole($profileId: ID) {
    addDatingSiteRole(input: { id: $profileId }) {
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
  addDatingSiteRole: {
    profile?: Profile
    error?: { message: string }
  }
}

export const addDatingSiteRole = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: ADD_DATING_SITE_ROLE,
    variables,
  })
