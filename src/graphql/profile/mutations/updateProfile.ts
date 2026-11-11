import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type Gender, type LocationInput, type Profile, type ProfileTitle, type ReligiousAffiliation } from '@/types'

const UPDATE_PROFILE = gql`
  mutation updateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      errors {
        message
      }
      profile {
        ...ProfileFragment
      }
    }
  }
  ${ProfileFragment}
`

export type UpdateProfileInput = Partial<{
  id: string
  firstName: string
  lastName: string
  displayName: string
  phone: string
  title: ProfileTitle
  birthday: Date
  gender: Gender
  occupation: string
  occupationId: string
  organization: string
  primaryLocation: LocationInput
  religiousAffiliation: ReligiousAffiliation
  about: string
  isMarried: boolean
  spouse: string
  children: number
  datingAvailable: boolean
  avatar: string
  wallpaper: string
}>

type Variables = {
  input: UpdateProfileInput
}

type ResponseData = {
  updateProfile: {
    profile?: Profile
    error?: { message: string }
  }
}

export const updateProfile = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: UPDATE_PROFILE,
    variables,
  })
