import gql from 'graphql-tag'

import { SettingsFragment } from '@/graphql/fragments/profileSettings'

const getProfileSettings = gql`
  query profileSettings($profileId: ID) {
    profileSettings(input: { profileId: $profileId }) {
      profileId
      settings {
        ...SettingsFragment
      }
    }
  }
  ${SettingsFragment}
`

export default getProfileSettings
