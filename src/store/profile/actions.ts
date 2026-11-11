import { type DocumentNode } from 'graphql'
import { type ActionTree } from 'vuex'

import {
  DeleteEndorsementDocument,
  EndorseDatingProspectDocument,
  EndorseGuestDocument,
  EndorseHostDocument,
  EndorsementByIdDocument,
  EndorseMultipleGuestsDocument,
  type IEndorseDatingProspectMutationVariables,
  type IEndorseGuestMutationVariables,
  type IEndorseHostMutationVariables,
  UpdateEndorsementDocument,
} from '@/composables/graphql/generated'
import {
  acceptDatingProfileRequest,
  addReference,
  approveReferencesRequest,
  deleteReference,
  downloadDatingProfile,
  emailDatingProfile,
  requestDatingProfile,
  requestReference,
  updateDatingProfile,
  updateReference,
} from '@/graphql/mutations'
import { mutateApollo, queryApollo } from '@/plugins/vue-apollo'
import { type MediaUrlInfo, type UploadMediaParams } from '@/store/media/types'
import { type RootState } from '@/store/types'
import {
  type Avatar,
  type Media,
  MediaSubType,
  type Picture,
  type Reference,
  SiteRole,
  type Wallpaper,
} from '@/types'
import { getMediaType } from '@/utils'

import { addSiteRole } from './actions/addSiteRole'
import { blockingProfiles } from './actions/blockingProfiles'
import { blockProfile } from './actions/blockProfile'
import { completeRegister } from './actions/completeRegister'
import { deleteProfilePicture } from './actions/deleteProfilePicture'
import { deleteSiteRole } from './actions/deleteSiteRole'
import { getActiveProfile } from './actions/getActiveProfile'
import { getActiveProfileFlags } from './actions/getActiveProfileFlags'
import { getOccupations } from './actions/getOccupations'
import { getProfile } from './actions/getProfile'
import { resendConfirmationEmail } from './actions/resendConfirmationEmail'
import { subscribeToProfile } from './actions/subscribeToProfile'
import { subscribeToSimpleProfiles } from './actions/subscribeToSimpleProfiles'
import { unblockProfile } from './actions/unblockProfile'
import { updateGuestProfile } from './actions/updateGuestProfile'
import { updateHostProfile } from './actions/updateHostProfile'
import { updateProfile } from './actions/updateProfile'
import { type EndorsementPayload, type ProfileState } from './types'

const actions: ActionTree<ProfileState, RootState> = {
  getActiveProfile,
  getOccupations,
  getProfile,
  getActiveProfileFlags,

  deleteProfilePicture,

  addSiteRole,
  deleteSiteRole,

  resendConfirmationEmail,
  completeRegister,

  updateProfile,

  subscribeToProfile,
  subscribeToSimpleProfiles,

  blockProfile,
  unblockProfile,
  blockingProfiles,

  updateGuestProfile,
  updateHostProfile,

  async approveReferencesRequest(store, params: { requestId: string }) {
    const response = await mutateApollo({
      mutation: approveReferencesRequest,

      variables: {
        requestId: params.requestId,
      },
    })

    return response.data.approveReferencesRequest
  },

  async getEndorsementById(_, endorsementId) {
    const { data } = await queryApollo({
      query: EndorsementByIdDocument,
      variables: {
        id: endorsementId,
      },
    })
    return data.endorsement
  },

  async addEndorsement({ commit }, params) {
    const { siteRole, endorsement: body, profileId, reference, endorsingBack } = params

    let mutation: DocumentNode
    let variables:
      | IEndorseDatingProspectMutationVariables
      | IEndorseHostMutationVariables
      | IEndorseGuestMutationVariables
    switch (siteRole) {
    case SiteRole.DATING:
      mutation = EndorseDatingProspectDocument
      variables = {
        input: {
          profileId,
          body,
          endorsingBack,
        },
      }
      break
    case SiteRole.HOST:
      mutation = EndorseHostDocument
      variables = {
        input: {
          profileId,
          body,
          reference,
          endorsingBack,
        },
      }
      break
    case SiteRole.GUEST:
    default:
      mutation = EndorseGuestDocument
      variables = {
        input: {
          profileId,
          body,
          reference,
          endorsingBack,
        },
      }
      break
    }
    const { data } = await mutateApollo({ mutation, variables })

    const result = data.endorseGuest || data.endorseHost || data.endorseDatingProspect
    commit('ADD_ENDORSEMENT', { siteRole, endorsement: result.endorsement, profileId })
    return result
  },

  async addMultipleGuestEndorsements (_, params) {
    const { endorsements } = params

    const { data } = await mutateApollo({
      mutation: EndorseMultipleGuestsDocument,
      variables: {
        input: {
          multipleEndorsements: endorsements
        }
      }
    })

    return data.endorseMultipleGuests
  },

  async updateEndorsement ({ commit }, params) {
    const { id, body, siteRole, profileId } = params
    const { data } = await mutateApollo({
      mutation: UpdateEndorsementDocument,
      variables: {
        id,
        body,
      },
    })

    const updatePayload: EndorsementPayload = {
      endorsement: data.updateEndorsement.endorsement,
      profileId,
      siteRole,
    }
    commit('UPDATE_ENDORSEMENT', updatePayload)
    return data.updateEndorsement.endorsement
  },

  async deleteEndorsement({ commit }, params) {
    const { id, siteRole, profileId } = params

    const { data } = await mutateApollo({
      mutation: DeleteEndorsementDocument,
      variables: {
        id,
      },
    })

    if (data.deleteEndorsement.deleted) {
      commit('DELETE_ENDORSEMENT', { id, siteRole, profileId })
    } else {
      throw new Error(data.deleteEndorsement.errors[0].message)
    }

    return id
  },

  async addReference({ commit }, params: Reference & { profileId: string }) {
    const { profileId } = params
    const { data } = await mutateApollo({
      mutation: addReference,
      variables: params,
    })

    const { reference } = data.addReference
    commit('ADD_PROFILE_REFERENCE', { profileId, reference })
  },

  async updateReference({ commit }, params: Reference & { profileId: string }) {
    const { profileId, ...referenceParams } = params
    const { data } = await mutateApollo({
      mutation: updateReference,
      variables: referenceParams,
    })

    const { reference } = data.updateReference

    commit('UPDATE_PROFILE_REFERENCE', { profileId, reference })
  },

  async deleteReference({ commit }, params: { id: string; profileId: string }) {
    const { id, profileId } = params
    const { data } = await mutateApollo({
      mutation: deleteReference,
      variables: { id },
    })

    if (data.deleteReference.deleted) {
      commit('DELETE_PROFILE_REFERENCE', { id, profileId })
    }
  },

  async requestReference({ commit }, profileId: string) {
    const { data } = await mutateApollo({
      mutation: requestReference,
      variables: { input: { profileId } },
    })

    if (data.requestReference.requested) {
      commit('REQUEST_REFERENCE')
    }
  },

  async uploadProfileImage(
    { state, commit, dispatch },
    params: {
      file: File
      mediaSubType: MediaSubType
      originalMediaId?: string
      profileId: string
      onUrlGenerated: (params: MediaUrlInfo) => void
    },
  ) {
    const { file, mediaSubType, originalMediaId, profileId, onUrlGenerated } = params
    const uploadMediaParams: UploadMediaParams = {
      file,
      mediaType: getMediaType(file),
      mediaSubType,
      profileId,
      onUrlGenerated,
    }
    if (originalMediaId) {
      uploadMediaParams.reference = { originalMediaId }
    }
    const { data, error } = await dispatch('media/uploadMedia', uploadMediaParams, { root: true })
    if (error) {
      return { error }
    }

    const media = data as Media

    // action for update profile
    if (mediaSubType === MediaSubType.AVATAR) {
      const avatar: Avatar = {
        id: media.id,
        originalMediaId,
        small: media.originalUrl,
        medium: media.originalUrl,
        large: media.originalUrl,
        original: media.originalUrl,
      }
      if (state.activeProfile && profileId === state.activeProfile.id) {
        commit('SET_ACTIVE_PROFILE_AVATAR', avatar)
      } else if (state.currentProfile && profileId === state.currentProfile.id) {
        commit('SET_CURRENT_PROFILE_AVATAR', avatar)
      }
    } else if (mediaSubType === MediaSubType.WALLPAPER) {
      const wallpaper: Wallpaper = {
        id: media.id,
        originalMediaId,
        original: media.originalUrl,
        isPlaceholder: false,
      }
      if (state.activeProfile && profileId === state.activeProfile.id) {
        commit('SET_ACTIVE_PROFILE_WALLPAPER', wallpaper)
      } else if (state.currentProfile && profileId === state.currentProfile.id) {
        commit('SET_CURRENT_PROFILE_WALLPAPER', wallpaper)
      }
    }
    return { data }
  },

  addPictureToProfile({ state, commit }, payload: { profileId: string; media: Media }) {
    const { profileId, media } = payload
    // this action does not actually upload a picture - it only adds to the profile store
    const picture: Picture = {
      id: media.id,
      originalMediaId: media.originalMediaId,
      original: media.originalUrl,
    } as Picture

    if (state.activeProfile && profileId === state.activeProfile.id) {
      commit('PUSH_ACTIVE_PROFILE_PICTURE', picture)
    } else if (state.currentProfile && profileId === state.currentProfile.id) {
      commit('PUSH_CURRENT_PROFILE_PICTURE', picture)
    }
  },

  updatePictureInProfile(
    { state, commit, dispatch },
    payload: { profileId: string; updatedMedia: Media; oldMediaId: string },
  ) {
    const { profileId, updatedMedia, oldMediaId } = payload
    // this action does not actually upload a picture - it only updates the store
    if (state.activeProfile && profileId === state.activeProfile.id) {
      commit('REMOVE_ACTIVE_PROFILE_PICTURE', oldMediaId)
    } else if (state.currentProfile && profileId === state.currentProfile.id) {
      commit('REMOVE_CURRENT_PROFILE_PICTURE', oldMediaId)
    }
    dispatch('addPictureToProfile', { profileId, media: updatedMedia })
  },

  removeAvatar({ state, commit }, payload: { profileId: string }) {
    const { profileId } = payload
    if (state.activeProfile && profileId === state.activeProfile.id) {
      commit('REMOVE_ACTIVE_PROFILE_AVATAR')
    } else if (state.currentProfile && profileId === state.currentProfile.id) {
      commit('REMOVE_CURRENT_PROFILE_AVATAR')
    }
  },

  async updateDatingProfile({ commit }, payload) {
    const { profileId, ...input } = payload
    const { data } = await mutateApollo({
      mutation: updateDatingProfile,
      variables: {
        updateDatingProfileInput: input,
      },
    })
    const { datingProfile } = data.updateDatingProfile

    commit('SET_DATING_PROFILE', { profileId, datingProfile })
  },

  async requestDatingProfile({ commit }, payload) {
    await mutateApollo({
      mutation: requestDatingProfile,
      variables: {
        requestDatingProfileInput: payload,
      },
    })
    commit('REQUEST_DATING_PROFILE')
  },

  async emailDatingProfile({ commit }, payload) {
    await mutateApollo({
      mutation: emailDatingProfile,
      variables: {
        emailDatingProfileInput: payload,
      },
    })
    commit('EMAIL_DATING_PROFILE')
  },

  async downloadDatingProfile({ commit }, payload) {
    const { data } = await mutateApollo({
      mutation: downloadDatingProfile,
      variables: {
        downloadDatingProfileInput: payload,
      },
    })
    commit('DOWNLOAD_DATING_PROFILE')
    return data.downloadDatingProfile
  },

  async acceptDatingProfileRequest({ commit }, payload) {
    const { data } = await mutateApollo({
      mutation: acceptDatingProfileRequest,
      variables: {
        acceptDatingProfileRequestInput: payload,
      },
    })
    commit('ACCEPT_DATING_PROFILE_REQUEST')
    return data.acceptDatingProfileRequest
  },
}

export default actions
