import gql from 'graphql-tag'

import { mutateApollo } from '@/plugins/vue-apollo'
import { type Preference } from '@/types'

const SET_PREFERENCE = gql`
  mutation setPreference($type: PreferenceType!, $preference: PreferenceInput) {
    setPreference(input: { type: $type, preference: $preference }) {
      profile {
        id
      }
    }
  }
`

type Variables = {
  type: 'search' | 'dating'
  preference: Preference
}

type ResponseData = {
  setPreference: {
    profile: { id: string }
  }
}

export type SetPreferenceVariables = Variables

export const setPreference = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: SET_PREFERENCE,
    variables,
  })
