import gql from 'graphql-tag'

import { HostProfileFragment } from '@/graphql/fragments/hostProfileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type HostProfile, type HostProfileStatus, type HostReserveBy } from '@/types'

const UPDATE_HOST_PROFILE = gql`
  mutation updateHostProfile($input: UpdateHostProfileInput!) {
    updateHostProfile(input: $input) {
      errors {
        message
      }
      hostProfile {
        ...HostProfileFragment
      }
    }
  }
  ${HostProfileFragment}
`

type Variables = {
  profileId: string
  hostingDate?: Date
  status?: HostProfileStatus
  reserveBy?: HostReserveBy
  mealAmount?: number
  sleepAmount?: number
  hostMen?: boolean
  hostWomen?: boolean
  hostFamiliesWithChildren?: boolean
  hostAffiliatedJews?: boolean
  hostUnAffiliatedJews?: boolean
  showGuestList?: boolean
}

type ResponseData = {
  updateHostProfile: {
    hostProfile?: HostProfile
    error?: { message: string }
  }
}

export const updateHostProfile = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: UPDATE_HOST_PROFILE,
    variables: { input: variables },
  })
