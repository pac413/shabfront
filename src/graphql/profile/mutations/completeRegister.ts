import gql from 'graphql-tag'

import { ProfileFragment } from '@/graphql/fragments/profileFragment'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type LocationInput, type Profile, type ProfileTitle, type ReligiousAffiliation, type SiteRole, type SupportedLocale } from '@/types'

const COMPLETE_REGISTER = gql`
  mutation completeRegister($input: CompleteRegisterInput!) {
    completeRegister(input: $input) {
      profile {
        ...ProfileFragment
      }
    }
  }
  ${ProfileFragment}
`

export type CompleteRegisterInput = {
  siteRoles: [SiteRole]
  location: LocationInput
  religiousAffiliation: ReligiousAffiliation
  title: ProfileTitle
  isMarried: boolean
  birthday: Date
  occupationId: number
  primaryLocale: SupportedLocale
  emailOptIn: boolean
}

type Variables = {
  input: CompleteRegisterInput
}

type ResponseData = {
  completeRegister: {
    profile: Profile
  }
}

export const completeRegister = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: COMPLETE_REGISTER,
    variables,
  })
