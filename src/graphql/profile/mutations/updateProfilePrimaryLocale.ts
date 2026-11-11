import gql from 'graphql-tag'

import { mutateApollo } from '@/plugins/vue-apollo'
import { type SupportedLocale } from '@/types'

const UPDATE_PROFILE_PRIMARY_LOCALE = gql`
  mutation updateProfilePrimaryLocale($primaryLocale: Locale!) {
    updateProfilePrimaryLocale(primaryLocale: $primaryLocale)
  }
`

type Variables = {
  primaryLocale: SupportedLocale
}

type ResponseData = {
  updateProfilePrimaryLocale: SupportedLocale
}

export const updateProfilePrimaryLocale = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: UPDATE_PROFILE_PRIMARY_LOCALE,
    variables,
  })
