import { type ActionTree } from 'vuex'

import { confirmAndProcessUploadedMedia, deleteMedia, getMediaUploadUrl, updateMedia } from '@/graphql/mutations'
import { getMediaById } from '@/graphql/queries'
import { mutateApollo, queryApollo } from '@/plugins/vue-apollo'
import { type RootState } from '@/store/types'
import { readFile, sendFile, type SendFileParams } from '@/utils'

import { type ConfirmMediaUploadParams, LocalMediaStatus, type MediaState, type UpdateMediaParams, type UploadMediaParams } from './types'

const actions: ActionTree<MediaState, RootState> = {
  async uploadMedia({ commit, dispatch }, params: UploadMediaParams) {
    const { file, mediaType, mediaSubType, reference, profileId, onUrlGenerated } = params
    const { data, error: getUploadUrlError } = await dispatch('getUploadUrl', {
      file,
      mediaType,
      mediaSubType,
      profileId,
    })
    if (getUploadUrlError) {
      return { error: new Error('Upload url was failed to fetch...') }
    }
    const { id, url } = data

    commit('SET_MEDIA_DATA', {
      id,
      data: {
        fileUrl: window.URL.createObjectURL(file),
        fileContent: await readFile(file),
        status: LocalMediaStatus.UPLOADING,
      },
    })

    // Inform the caller to get updated for generated url
    if (onUrlGenerated) {
      onUrlGenerated({ id, url })
    }
    const sendConfig: SendFileParams = {
      url,
      onProgress(sentBytes: number, totalBytes: number) {
        commit('SET_MEDIA_DATA', { id, data: { sentBytes, totalBytes } })
      },
    }

    try {
      await sendFile(file, sendConfig)
    } catch (error: any) {
      commit('SET_MEDIA_DATA', { id, data: { status: LocalMediaStatus.ERROR_UPLOADING } })
      return { error }
    }
    commit('SET_MEDIA_DATA', { id, data: { status: 'reporting' } })

    const mediaUploadParams: ConfirmMediaUploadParams = {
      id,
      mediaType,
      mediaSubType,
      file,
      reference,
      profileId,
      mimetype: file.type,
    }
    const response = await dispatch('confirmAndProcessUploadedMedia', mediaUploadParams)
    const status = response.data ? LocalMediaStatus.COMPLETED : LocalMediaStatus.ERROR_CONFIRMING
    commit('SET_MEDIA_DATA', { id, data: { status } })
    return { data: response.data }
  },

  async getUploadUrl(_, params: UploadMediaParams) {
    const { file, mediaType, mediaSubType, profileId } = params
    const response = await mutateApollo({
      mutation: getMediaUploadUrl,
      variables: {
        filename: file.name,
        mediaType,
        mediaSubType,
        mimetype: file.type,
        profileId,
      },
    })
    if (!response.data.getMediaUploadUrl) {
      return { error: new Error('get upload url failed') }
    }
    return { data: response.data.getMediaUploadUrl }
  },

  async confirmAndProcessUploadedMedia(_, params: ConfirmMediaUploadParams) {
    const { id, file, reference, mediaType, mediaSubType, profileId, mimetype } = params
    const response = await mutateApollo({
      mutation: confirmAndProcessUploadedMedia,
      variables: {
        id,
        filename: file.name,
        mediaType,
        mediaSubType,
        reference,
        profileId,
        mimetype,
      },
    })
    if (!response.data.confirmAndProcessUploadedMedia) {
      return { error: new Error('confirm upload url failed') }
    }
    return { data: response.data.confirmAndProcessUploadedMedia }
  },

  getMediaWithFallback({ dispatch }, media) {
    const { originalMediaId, id } = media
    return dispatch('getMediaById', originalMediaId || id).catch(() => dispatch('getMediaById', id))
  },

  async getMediaById(_, id: string) {
    const response = await queryApollo({
      query: getMediaById,
      variables: { id },
    })
    if (!response.data.getMedia) {
      return { error: new Error('get media failed') }
    }
    return { data: response.data.getMedia }
  },

  async updateMedia(_, payload: UpdateMediaParams) {
    await mutateApollo({
      mutation: updateMedia,
      variables: { input: payload },
    })
  },

  async deleteMedia(_, params: { id: string; keepOriginal?: boolean }) {
    const { id, keepOriginal } = params
    const response = await mutateApollo({
      mutation: deleteMedia,
      variables: { id, keepOriginal: !!keepOriginal }, // by default, keepOriginal will be false to remove original image
    })
    if (!response.data.deleteMedia) {
      return { error: new Error('delete media failed') }
    }
    return { data: response.data.deleteMedia }
  },
}

export default actions
