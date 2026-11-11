import type { GetterTree } from 'vuex'

import { IFeedContentSetting } from '@/composables/graphql/generated'
import type { RootState } from '@/store/types'
import { type ProfileAvailbilitySettings, SiteRole } from '@/types'

import type { ProfileSettingsState } from './types'

const getters: GetterTree<ProfileSettingsState, RootState> = {
  currentAvailbilitySettings: (state, getters, rootState) => {
    const availabilitySettings: ProfileAvailbilitySettings = {}
    const { activeProfile, currentProfile } = rootState.profile
    const profile = currentProfile || activeProfile

    if (profile) {
      if (profile.guestProfile) {
        availabilitySettings.availableAsGuest = profile.guestProfile.status === 'AVAILABLE'
      }
      if (profile.hostProfile) {
        availabilitySettings.availableAsHost = profile.hostProfile.status === 'AVAILABLE'
      }
      availabilitySettings.availableForDating = profile.siteRoles.includes(SiteRole.DATING)
      if (profile.datingProfile) {
        availabilitySettings.privateDatingProfile = profile.datingProfile.isPrivate
      }
    }
    return availabilitySettings
  },

  currentFeedSettings: (state): IFeedContentSetting | null => {
    const settings = state.currentSettings
    if (settings === null) {
      return null
    }

    return settings.feedContent || null
  },

  isTrending: (state): boolean => {
    const settings = state.currentSettings
    if (settings === null) {
      return false
    }

    return settings.feedContent === IFeedContentSetting.Trending
  },

  hideAllMedia: (state): boolean => {
    const settings = state.currentSettings
    if (settings === null) {
      return false
    }

    return !!settings.hideAllMedia
  },

  paginatedSearchResult: (state): Boolean => {
    return state.currentSettings?.paginatedSearchResult ?? false
  },
}

export default getters
