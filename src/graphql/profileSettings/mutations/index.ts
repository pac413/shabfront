import gql from 'graphql-tag'

import { SettingsFragment } from '@/graphql/fragments/profileSettings'

export const updateProfileSettingsBooleans = gql`
  mutation updateProfileSettingsBooleans($profileId: String!, $setting: BooleanProfileSetting!, $value: Boolean!) {
    updateProfileSettingsBooleans(input: { profileId: $profileId, setting: $setting, value: $value }) {
      profileId
      settings {
        ...SettingsFragment
      }
    }
  }
  ${SettingsFragment}
`

export const updateProfileSettingsMessagingPrivacyTier = gql`
  mutation updateProfileSettingsMessagingPrivacyTier($profileId: String!, $value: MessagingPrivacyTier!) {
    updateProfileSettingsMessagingPrivacyTier(input: { profileId: $profileId, value: $value }) {
      profileId
      settings {
        ...SettingsFragment
      }
    }
  }
  ${SettingsFragment}
`

export const updateProfileSettingsPostPrivacy = gql`
  mutation updateProfileSettingsPostPrivacy($profileId: String!, $value: PostPrivacySetting) {
    updateProfileSettingsPostPrivacy(input: { profileId: $profileId, value: $value }) {
      profileId
      settings {
        ...SettingsFragment
      }
    }
  }
  ${SettingsFragment}
`

export const updateProfileSettingsFeedContent = gql`
  mutation updateProfileSettingsFeedContent($profileId: String!, $value: FeedContentSetting) {
    updateProfileSettingsFeedContent(input: { profileId: $profileId, value: $value }) {
      profileId
      settings {
        ...SettingsFragment
      }
    }
  }
  ${SettingsFragment}
`
