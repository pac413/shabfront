import type { RouteLocationRaw } from 'vue-router'

import type {
  IFeedContentSetting,
  IMessagingPrivacyTier,
  IPostPrivacySetting,
  IProfileSettings,
  ISiteRole,
} from '@/composables/graphql/generated'

export interface ProfileSettingsLink {
  route: RouteLocationRaw
  text: string
}

export interface ProfileSettingsItem {
  id:
    | keyof IProfileSettings
    | 'availableAsGuest'
    | 'availableAsHost'
    | 'availableForDating'
    | 'privateDatingProfile'
    | 'view-blocking'
  type: 'switch' | 'radio-group' | 'button'
  link?: ProfileSettingsLink
  desc?: string
  options?:
    | Array<IMessagingPrivacyTier>
    | Array<IPostPrivacySetting>
    | Array<IFeedContentSetting>
}

export interface ProfileSettingsGroup {
  id: string
  icon: [string, string] | string
  items?: ProfileSettingsItem[]
  groups?: ProfileSettingsGroup[]
  link?: ProfileSettingsLink
  desc?: string
}

export type ProfileSettingsValueType =
  | IMessagingPrivacyTier
  | ISiteRole[]
  | IPostPrivacySetting
  | IFeedContentSetting
  | boolean
