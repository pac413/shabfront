import {
  type Avatar,
  type DatingProfile,
  type GuestProfile,
  type HostProfile,
  type Occupation,
  type Picture,
  type Profile,
  type Reference,
  type SimpleProfile,
  SiteRole,
  type Wallpaper,
} from '@/types'

import { SET_IS_BLOCKING } from './mutations/SET_IS_BLOCKING'
import type { EndorsementPayload, ProfileState } from './types'

const getEndorsementsBySiteRole = (currentProfile: Profile, siteRole: SiteRole) => {
  if (siteRole === SiteRole.DATING) {
    return currentProfile.datingProfile?.datingEndorsements
  }
  if (siteRole === SiteRole.GUEST) {
    return currentProfile.guestProfile?.guestEndorsements
  }
  if (siteRole === SiteRole.HOST) {
    return currentProfile.hostProfile?.hostEndorsements
  }
}

const mutations = {
  SET_IS_BLOCKING,
  SET_ACTIVE_PROFILE(state: ProfileState, payload: Profile) {
    state.activeProfile = payload
  },

  SET_CURRENT_PROFILE(state: ProfileState, payload: Profile) {
    state.currentProfile = payload
  },

  UPDATE_ACTIVE_PROFILE(state: ProfileState, payload: Profile) {
    state.activeProfile = {
      ...state.activeProfile,
      ...payload,
    }
  },

  UPDATE_PARTIAL_PROFILE(state: ProfileState, payload: { id: string; updates: Partial<Omit<Profile, 'id'>> }) {
    const { id, updates } = payload
    if (state.activeProfile?.id === id) {
      state.activeProfile = {
        ...state.activeProfile,
        ...updates,
      }
    }
    if (state.currentProfile?.id === id) {
      state.currentProfile = {
        ...state.currentProfile,
        ...updates,
      }
    }
  },

  SET_PROFILES(state: ProfileState, profiles: Profile[]) {
    const { activeProfile, currentProfile } = state
    // Get unique profile array
    const uniqueProfiles = profiles.filter((profile, pos) => {
      // No need to include activeProfile
      if ((activeProfile && profile.id === activeProfile.id) || (currentProfile && profile.id === currentProfile.id)) {
        return false
      }
      const index = profiles.findIndex((item) => item.id === profile.id)
      return index === pos
    })
    state.profiles = uniqueProfiles
  },

  PUSH_PROFILES(state: ProfileState, profiles: SimpleProfile[]) {
    let updatedProfiles = state.profiles.concat(profiles)
    const { activeProfile, currentProfile } = state
    // Get unique profile array
    updatedProfiles = updatedProfiles.filter((profile, pos) => {
      // No need to include activeProfile or currentProfile
      if ((activeProfile && profile.id === activeProfile.id) || (currentProfile && profile.id === currentProfile.id)) {
        return false
      }
      const index = updatedProfiles.findIndex((item) => item.id === profile.id)
      return index === pos
    })
    state.profiles = updatedProfiles
  },

  UPDATE_PROFILE(state: ProfileState, profile: Profile) {
    const index = state.profiles.findIndex((item) => item.id === profile.id)
    if (index === -1) {
      state.profiles.push(profile)
    } else {
      state.profiles.splice(index, 1, profile)
    }
  },

  SET_ACTIVE_GUEST_PROFILE(state: ProfileState, guestProfile: GuestProfile) {
    if (!state.activeProfile) {
      return
    }
    state.activeProfile = {
      ...state.activeProfile,
      guestProfile,
    }
  },

  SET_CURRENT_GUEST_PROFILE(state: ProfileState, payload: { guestProfile: GuestProfile; profileId: string }) {
    if (!state.currentProfile) {
      return
    }
    const { guestProfile, profileId } = payload

    if (state.currentProfile.id !== profileId) {
      return
    }
    state.currentProfile = {
      ...state.currentProfile,
      guestProfile,
    }
  },

  SET_ACTIVE_HOST_PROFILE(state: ProfileState, hostProfile: HostProfile) {
    if (!state.activeProfile) {
      return
    }
    state.activeProfile = {
      ...state.activeProfile,
      hostProfile,
    }
  },

  SET_CURRENT_HOST_PROFILE(state: ProfileState, payload: { hostProfile: HostProfile; profileId: string }) {
    if (!state.currentProfile) {
      return
    }
    const { hostProfile, profileId } = payload

    if (state.currentProfile.id !== profileId) {
      return
    }
    state.currentProfile = {
      ...state.currentProfile,
      hostProfile,
    }
  },

  SET_ACTIVE_PROFILE_AVATAR(state: ProfileState, avatar: Avatar) {
    if (!state.activeProfile) {
      return
    }
    state.activeProfile = {
      ...state.activeProfile,
      avatar,
    }
  },

  REMOVE_ACTIVE_PROFILE_AVATAR(state: ProfileState) {
    if (!state.activeProfile) {
      return
    }
    state.activeProfile = {
      ...state.activeProfile,
      avatar: null,
    }
  },

  SET_ACTIVE_PROFILE_WALLPAPER(state: ProfileState, wallpaper: Wallpaper) {
    if (!state.activeProfile) {
      return
    }
    state.activeProfile = {
      ...state.activeProfile,
      wallpaper,
    }
  },

  PUSH_ACTIVE_PROFILE_PICTURE(state: ProfileState, picture: Picture) {
    if (!state.activeProfile) {
      return
    }
    const idx = state.activeProfile.pictures.findIndex((p) => p.id === picture.id)
    if (idx < 0) {
      state.activeProfile.pictures.unshift(picture)
    } else {
      state.activeProfile.pictures.splice(idx, 1, picture)
    }
  },

  REMOVE_ACTIVE_PROFILE_PICTURE(state: ProfileState, id: string) {
    if (!state.activeProfile) {
      return
    }
    const index = state.activeProfile.pictures.findIndex((item) => item.id === id)
    if (index > -1) {
      state.activeProfile.pictures.splice(index, 1)
    }
  },

  SET_CURRENT_PROFILE_AVATAR(state: ProfileState, avatar: Avatar | null) {
    if (!state.currentProfile) {
      return
    }
    state.currentProfile = {
      ...state.currentProfile,
      avatar,
    }
  },

  REMOVE_CURRENT_PROFILE_AVATAR(state: ProfileState) {
    if (!state.currentProfile) {
      return
    }
    state.currentProfile = {
      ...state.currentProfile,
      avatar: null,
    }
  },

  SET_CURRENT_PROFILE_WALLPAPER(state: ProfileState, wallpaper: Wallpaper) {
    if (!state.currentProfile) {
      return
    }
    state.currentProfile = {
      ...state.currentProfile,
      wallpaper,
    }
  },

  PUSH_CURRENT_PROFILE_PICTURE(state: ProfileState, picture: Picture) {
    if (!state.currentProfile) {
      return
    }
    const idx = state.currentProfile.pictures.findIndex((p) => p.id === picture.id)
    if (idx < 0) {
      state.currentProfile.pictures.unshift(picture)
    } else {
      state.currentProfile.pictures.splice(idx, 1, picture)
    }
  },

  REMOVE_CURRENT_PROFILE_PICTURE(state: ProfileState, id: string) {
    if (!state.currentProfile) {
      return
    }
    const index = state.currentProfile.pictures.findIndex((item) => item.id === id)
    if (index > -1) {
      state.currentProfile.pictures.splice(index, 1)
    }
  },

  SET_DATING_PROFILE(state: ProfileState, payload: { datingProfile: DatingProfile; profileId: string }) {
    const { datingProfile, profileId } = payload
    if (state.currentProfile && state.currentProfile.id === profileId) {
      state.currentProfile = {
        ...state.currentProfile,
        datingProfile,
      }
    }
    if (state.activeProfile && state.activeProfile.id === profileId) {
      state.activeProfile = {
        ...state.activeProfile,
        datingProfile,
      }
    }
  },

  ADD_ENDORSEMENT(state: ProfileState, payload: EndorsementPayload) {
    if (!state.currentProfile) {
      return
    }
    const { siteRole, endorsement, profileId } = payload

    if (state.currentProfile.id !== profileId) {
      return
    }

    const siteRoleEndorsements = getEndorsementsBySiteRole(state.currentProfile, siteRole)
    if (!siteRoleEndorsements) {
      if (siteRole === SiteRole.DATING) {
        state.currentProfile.datingProfile!.datingEndorsements = {
          endorsements: [endorsement],
          total: 1
        }
      } else if (siteRole === SiteRole.GUEST) {
        state.currentProfile.guestProfile!.guestEndorsements = {
          endorsements: [endorsement],
          total: 1
        }
      } else if (siteRole === SiteRole.HOST) {
        state.currentProfile.hostProfile!.hostEndorsements = {
          endorsements: [endorsement],
          total: 1
        }
      }
    } else {
      siteRoleEndorsements.endorsements.unshift(endorsement)
      siteRoleEndorsements.total += 1
    }
  },

  UPDATE_ENDORSEMENT(state: ProfileState, payload: EndorsementPayload) {
    if (!state.currentProfile) {
      return
    }
    const { siteRole, endorsement, profileId } = payload

    if (state.currentProfile.id !== profileId) {
      return
    }

    const siteRoleEndorsements = getEndorsementsBySiteRole(state.currentProfile, siteRole)
    if (!siteRoleEndorsements) {return}

    const index = siteRoleEndorsements.endorsements.findIndex(item => item.id === endorsement.id)
    if (index >= 0) {
      siteRoleEndorsements.endorsements.splice(index, 1, endorsement)
    }
  },

  DELETE_ENDORSEMENT(state: ProfileState, payload: { id: string; profileId: string; siteRole: SiteRole }) {
    if (!state.currentProfile) {
      return
    }
    const { siteRole, id, profileId } = payload

    if (state.currentProfile.id !== profileId) {
      return
    }

    const siteRoleEndorsements = getEndorsementsBySiteRole(state.currentProfile, siteRole)
    if (!siteRoleEndorsements) {return}

    const index = siteRoleEndorsements.endorsements.findIndex(item => item.id === id)
    if (index >= 0) {
      siteRoleEndorsements.endorsements.splice(index, 1)
    }
  },

  SET_OCCUPATIONS(state: ProfileState, payload: Occupation[]) {
    state.occupations = payload
  },

  ADD_PROFILE_REFERENCE(state: ProfileState, params: { profileId: string; reference: Reference }) {
    if (!state.activeProfile) {
      return
    }
    const { profileId, reference } = params
    const { id, references } = state.activeProfile

    if (id !== profileId || !references) {
      return
    }

    references.push(reference)
  },

  UPDATE_PROFILE_REFERENCE(state: ProfileState, params: { profileId: string; reference: Reference }) {
    if (!state.activeProfile) {
      return
    }
    const { profileId, reference } = params
    const { id, references } = state.activeProfile

    if (id !== profileId || !references) {
      return
    }

    const jdx = references.findIndex((r) => r.id === reference.id)
    if (jdx < 0) {
      return
    }
    references.splice(jdx, 1, reference)
  },

  DELETE_PROFILE_REFERENCE(state: ProfileState, params: { id: string; profileId: string }) {
    if (!state.activeProfile) {
      return
    }
    const { id, profileId } = params
    const { id: activeProfileId, references } = state.activeProfile

    if (activeProfileId !== profileId || !references) {
      return
    }

    const jdx = references.findIndex((r) => r.id === id)
    if (jdx < 0) {
      return
    }
    references.splice(jdx, 1)
  },

  REQUEST_DATING_PROFILE() {},
  EMAIL_DATING_PROFILE() {},
  DOWNLOAD_DATING_PROFILE() {},
  ACCEPT_DATING_PROFILE_REQUEST() {},

  SET_PROFILES_SUBSCRIPTION(state: ProfileState, params: { profileIds: string[] }) {
    const { profileIds } = params
    state.profilesSubscriptionIds = profileIds
  },

  SET_BLOCKING_PROFILES(state: ProfileState, payload: { blockingProfiles: SimpleProfile[]; profileId: string }) {
    const { profileId, blockingProfiles } = payload
    state.blockingProfiles = {
      ...state.blockingProfiles,
      [profileId]: blockingProfiles,
    }
  },

  REMOVE_BLOCKING_PROFILE(state: ProfileState, payload: { profile: SimpleProfile; onbehalfId: string }) {
    const { profile, onbehalfId } = payload
    const index = state.blockingProfiles[onbehalfId].findIndex((item) => item.id === profile.id)
    if (index > -1) {
      state.blockingProfiles[onbehalfId].splice(index, 1)
    }
  },
}

export default mutations
