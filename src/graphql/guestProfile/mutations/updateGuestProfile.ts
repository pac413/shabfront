import gql from 'graphql-tag'

import { GuestProfileFragment } from '@/graphql/fragments/guestProfileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type GuestAvailabilityStatus, type GuestProfile } from '@/types'

const UPDATE_GUEST_PROFILE = gql`
  mutation updateGuestProfile($input: UpdateGuestProfileInput!) {
    updateGuestProfile(input: $input) {
      errors {
        message
      }
      guestProfile {
        ...GuestProfileFragment
      }
    }
  }
  ${GuestProfileFragment}
`

type Variables = {
  profileId: string
  status: GuestAvailabilityStatus
}

type ResponseData = {
  updateGuestProfile: {
    guestProfile?: GuestProfile
    error?: { message: string }
  }
}

export const updateGuestProfile = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: UPDATE_GUEST_PROFILE,
    variables: { input: variables },
  })
