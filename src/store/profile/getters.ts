import { type GetterTree } from 'vuex'

import { type RootState } from '@/store/types'
import { type SimpleProfile, SiteRole } from '@/types'
import { getLocationDisplay } from '@/utils'

import { type ProfileState } from './types'

const getters: GetterTree<ProfileState, RootState> = {
  viewingSelf: (state, getters, rootState) => {
    return !state.currentProfile || rootState.auth.profileId === state.currentProfile.id
  },
  isGuest: (state) => state.currentProfile && state.currentProfile.siteRoles.includes(SiteRole.GUEST),
  isHost: (state) => state.currentProfile && state.currentProfile.siteRoles.includes(SiteRole.HOST),
  isDating: (state) => state.currentProfile && state.currentProfile.siteRoles.includes(SiteRole.DATING),
  currentFriendshipStatus: (state, _, rootState: RootState) => {
    const { currentProfile } = state
    const { friendships } = rootState.connections
    if (!currentProfile) {
      return
    }
    if (currentProfile.id in friendships) {
      return friendships[currentProfile.id] && friendships[currentProfile.id].status
    }
    return currentProfile.friendship && currentProfile.friendship.status
  },
  isFollowingCurrentProfile: (state, _, rootState: RootState): boolean => {
    if (!state.currentProfile) {
      return false
    }
    const { myFollowingIds } = rootState.connections
    return myFollowingIds.includes(state.currentProfile.id)
  },
  isConnection: (_, getters) => {
    return getters.isFollowingCurrentProfile || getters.currentFriendshipStatus
  },
  location: (state) => {
    if (!state.activeProfile) {
      return ''
    }
    return state.activeProfile.primaryLocation
  },
  locationText: (state) => {
    if (!state.activeProfile) {
      return ''
    }
    return getLocationDisplay(state.activeProfile.primaryLocation)
  },
  simpleProfileById:
    (state: ProfileState) =>
      (id: string): SimpleProfile | null => {
        const { activeProfile, currentProfile } = state
        if (activeProfile && id === activeProfile!.id) {
          return activeProfile
        } else if (currentProfile && id === currentProfile!.id) {
          return currentProfile!
        } else {
          return state.profiles.find((profile) => profile.id === id) || null
        }
      },
  blockingProfilesById:
    (state: ProfileState) =>
      (id: string): SimpleProfile[] => {
        return state.blockingProfiles[id] || []
      },
}

export default getters
